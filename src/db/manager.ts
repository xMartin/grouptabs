import PouchDB from 'pouchdb';
// @ts-ignore
import allDbs from 'pouchdb-all-dbs';
import Tab, { Document } from './tab';
import config from '../config';
import { Info, ActionMap } from '../types';

type changesCallback = (actionMap: ActionMap) => void;

export default class DbManager {

  dbs: {[dbName: string]: Tab};

  private _changesCallback?: changesCallback;

  constructor() {
    this.dbs = {};

    allDbs(PouchDB, {noCache: true});
  }

  init(callback: changesCallback) {
    this._changesCallback = callback;

    return this.initDbs();
  }

  async connect() {
    const docsPerDb = await Promise.all(this.getAllDbs().map(async (db) => {
      const docs = await db.db.connect();
      return this.transformDocs(db.tabId, docs);
    }));
    let flat: any[] = [];
    docsPerDb.forEach((docs) => {
      flat = flat.concat(docs);
    });
    if (!this._changesCallback) {
      throw new Error('Callback not set.');
    }
    this._changesCallback({
      createOrUpdate: flat,
      delete: []
    });
    this.initAllDbsListener();
  }

  initAllDbsListener() {
    setInterval(async () => {
      const knownTabIds = Object.keys(this.dbs);
      // @ts-ignore
      const dbNames: string[] = await PouchDB.allDbs();
      const tabIds = dbNames.map((dbName) => dbName.substring(4));  // strip "tab/"
      const newTabIds = tabIds.filter((tabId) => knownTabIds.indexOf(tabId) === -1);
      newTabIds.forEach(async (tabId) => {
        const actionMap = await this.connectTab(tabId);
        if (!this._changesCallback) {
          throw new Error('Callback not set.');
        }
        this._changesCallback(actionMap);
      });
    }, 7500);
  }

  async createDoc(doc: any) {
    const dbDoc = {...doc};

    if (doc.id) {
      dbDoc._id = doc.id;
      delete dbDoc.id;
    }

    delete dbDoc.tabId;

    await this.dbs[doc.tabId].createDoc(dbDoc);
  }

  async updateDoc(doc: any) {
    const dbDoc = {...doc};

    dbDoc._id = doc.id;
    delete dbDoc.id;
    delete dbDoc.tabId;

    await this.dbs[doc.tabId].updateDoc(dbDoc);
  }

  async deleteDoc(doc: any) {
    await this.dbs[doc.tabId].deleteDoc(doc.id);
  }

  async createTab(doc: any) {
    const db = this.initDb('tab/' + doc.tabId);

    await this.createDoc(doc);
    db.startSyncing();
  }

  checkTab(tabId: string): Promise<Info> {
    const dbName = 'tab/' + tabId
    const remoteDbLocation = config.backendUrl + '/' + encodeURIComponent(dbName);

    const db = new PouchDB(remoteDbLocation);

    return db.get('info');
  }

  async connectTab(id: string) {
    const db = this.initDb('tab/' + id);

    const docs = await db.connect();
    return {
      createOrUpdate: this.transformDocs(id, docs),
      delete: []
    };
  }

  getAllDbs(): {tabId: string, db: Tab}[] {
    const allDbs = [];
    for (var dbName in this.dbs) {
      allDbs.push({
        tabId: dbName,
        db: this.dbs[dbName]
      });
    }
    return allDbs;
  }

  async initDbs() {
    // @ts-ignore
    const dbNames: string[] = await PouchDB.allDbs();
    dbNames.map((dbName) => this.initDb(dbName));
  }

  initDb(dbName: string): Tab {
    const remoteDbLocation = config.backendUrl + '/' + encodeURIComponent(dbName);
    const tabId = dbName.substring(4);  // strip "tab/"
    return this.dbs[tabId] = new Tab(dbName, remoteDbLocation, () => this._changesHandler.bind(this, tabId));
  }

  _changesHandler(tabId: string, changes: PouchDB.Core.ChangesResponseChange<any>[]) {
    const createOrUpdate = (
      changes
      .filter((change) => !change.deleted)
      .map((change) => this.transformDoc(tabId, change.doc))
    );

    const delete_ = (
      changes
      .filter((change) => change.deleted)
      .map((change) => this.transformDoc(tabId, change.doc))
    );

    if (!this._changesCallback) {
      throw new Error('Callback not set.');
    }

    this._changesCallback({
      createOrUpdate,
      delete: delete_
    });
  }

  transformDocs(tabId: string, docs: Document[]) {
    return docs.map(this.transformDoc.bind(this, tabId));
  }

  transformDoc(tabId: string, dbDoc: Document) {
    const doc = {...dbDoc};
    doc.id = doc._id;
    doc.tabId = tabId;
    delete doc._rev;
    delete doc._id;
    return doc;
  }

}
