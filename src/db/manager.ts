import PouchDB from 'pouchdb';
import MemoryAdapter from 'pouchdb-adapter-memory';
import Tab, { Document } from './tab';
import config from '../config';
import { Info, ActionMap } from '../types';
import { loadTabIds, addTabId } from './tabidpersistor';

PouchDB.plugin(MemoryAdapter);

interface Entity extends Record<string, any> {
  id: string;
  type: string;
  tabId: string;
}

type changesCallback = (actionMap: ActionMap) => void;

export default class DbManager {

  dbs: {[dbName: string]: Tab};

  private _changesCallback?: changesCallback;

  constructor() {
    this.dbs = {};
  }

  init(callback: changesCallback) {
    this._changesCallback = callback;

    return this.initDbs();
  }

  async connect() {
    const docsPerDb = await Promise.all(this.getAllDbs().map(async (db) => {
      const docs = await db.db.connect();
      // @ts-ignore (apparently items in docs could be undefined)
      return this.docsToEntities(db.tabId, docs);
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
      const tabIds = loadTabIds();
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

  async createDoc(entity: Entity) {
    const doc = this.entityToDoc(entity);
    await this.dbs[doc.tabId].createDoc(doc);
  }

  async updateDoc(entity: Entity) {
    const doc = this.entityToDoc(entity);
    await this.dbs[doc.tabId].updateDoc(doc);
  }

  async deleteDoc(doc: Entity) {
    await this.dbs[doc.tabId].deleteDoc(doc.id);
  }

  async createTab(doc: Entity) {
    const db = this.initDb(doc.tabId);

    await this.createDoc(doc);
    db.startSyncing();
  }

  checkTab(tabId: string): Promise<Info> {
    const dbName = 'tab/' + tabId;
    const remoteDbLocation = config.backendUrl + '/' + encodeURIComponent(dbName);

    const db = new PouchDB(remoteDbLocation);

    return db.get('info');
  }

  async connectTab(id: string) {
    const db = this.initDb(id);

    const docs = await db.connect();
    return {
      // @ts-ignore (apparently items in docs could be undefined)
      createOrUpdate: this.docsToEntities(id, docs),
      delete: []
    };
  }

  getAllDbs(): {tabId: string, db: Tab}[] {
    const allDbs = [];
    for (const dbName in this.dbs) {
      allDbs.push({
        tabId: dbName,
        db: this.dbs[dbName]
      });
    }
    return allDbs;
  }

  initDbs() {
    const tabIds = loadTabIds();
    tabIds.forEach((tabId) => this.initDb(tabId));
  }

  initDb(tabId: string): Tab {
    const dbName = 'tab/' + tabId;
    const remoteDbLocation = config.backendUrl + '/' + encodeURIComponent(dbName);
    const tab = new Tab(dbName, remoteDbLocation, () => this._changesHandler.bind(this, tabId));
    this.dbs[tabId] = tab;
    addTabId(tabId);
    return tab;
  }

  _changesHandler(tabId: string, changes: PouchDB.Core.ChangesResponseChange<Document>[]) {
    const createOrUpdate = (
      changes
      .filter((change) => !change.deleted)
      // @ts-ignore (`as Exclude<typeof change.doc, undefined>` helps)
      .map((change) => this.docToEntity(tabId, change.doc))
    );

    const delete_ = (
      changes
      .filter((change) => change.deleted)
      // @ts-ignore (`as Exclude<typeof change.doc, undefined>` helps)
      .map((change) => this.docToEntity(tabId, change.doc))
    );

    if (!this._changesCallback) {
      throw new Error('Callback not set.');
    }

    this._changesCallback({
      createOrUpdate,
      delete: delete_
    });
  }

  entityToDoc(entity: Entity): Document {
    const doc: any = {...entity};

    doc._id = doc.id;
    delete doc.id;
    delete doc.tabId;

    return doc as Document;
  }

  docsToEntities(tabId: string, docs: Document[]): Entity[] {
    return docs.map(this.docToEntity.bind(this, tabId));
  }

  docToEntity(tabId: string, doc: Document): Entity {
    const docCopy = {...doc};
    delete docCopy._rev;
    delete docCopy._id;
    const entity: Entity = {
      ...docCopy,
      id: doc._id,
      tabId
    };
    return entity;
  }

}
