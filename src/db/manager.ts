import PouchDB from "pouchdb-browser";
import Tab, { Document } from "./tab";
import config from "../config";
import { Info, Entity, ActionMap } from "../types";
import { loadTabIds, addTabId } from "./tabidpersistor";

type changesCallback = (actionMap: ActionMap) => void;

export default class DbManager {
  private isIndexedDbAvailable?: boolean;

  private readonly dbs: { [dbName: string]: Tab };

  private onChanges?: changesCallback;

  constructor() {
    this.dbs = {};
  }

  async init(callback: changesCallback): Promise<void> {
    this.onChanges = callback;

    await this.checkIndexedDb();
    this.initDbs();
  }

  private async checkIndexedDb() {
    try {
      const db = new PouchDB("test");
      this.isIndexedDbAvailable = true;
      await db.destroy();
    } catch (error: any) {
      if (error.name === "indexed_db_went_bad") {
        this.isIndexedDbAvailable = false;
        console.info("Accessing IndexedDB failed. Falling back to in-memory.");
        const { default: MemoryAdapter } = await import(
          "pouchdb-adapter-memory"
        );
        PouchDB.plugin(MemoryAdapter);
      } else {
        throw error;
      }
    }
  }

  async connect() {
    const docsPerDb = await Promise.all(
      this.getAllDbs().map(async (db) => {
        const docs = await db.db.connect({ initialReplicationTimeout: 3200 });
        return this.docsToEntities(db.tabId, docs);
      })
    );
    let flat: Entity[] = [];
    docsPerDb.forEach((docs) => {
      flat = flat.concat(docs);
    });
    if (!this.onChanges) {
      throw new Error("Callback not set.");
    }
    this.onChanges({
      createOrUpdate: flat,
      delete: [],
    });
    this.initAllDbsListener();
  }

  private initAllDbsListener() {
    setInterval(() => {
      const knownTabIds = Object.keys(this.dbs);
      const tabIds = loadTabIds();
      const newTabIds = tabIds.filter(
        (tabId) => knownTabIds.indexOf(tabId) === -1
      );
      newTabIds.forEach((tabId) => {
        void this.connectTab(tabId).then((actionMap) => {
          if (!this.onChanges) {
            throw new Error("Callback not set.");
          }
          this.onChanges(actionMap);
        });
      });
    }, 7500);
  }

  async createDoc(entity: Entity) {
    const doc = this.entityToDoc(entity);
    await this.dbs[entity.tabId].createDoc(doc);
  }

  async updateDoc(entity: Entity) {
    const doc = this.entityToDoc(entity);
    await this.dbs[entity.tabId].updateDoc(doc);
  }

  async deleteDoc(entity: Entity) {
    await this.dbs[entity.tabId].deleteDoc(entity.id);
  }

  async createTab(doc: Info) {
    const db = this.initDb(doc.tabId);

    await this.createDoc(doc);
    db.startSyncing();
  }

  checkTab(tabId: string): Promise<Info> {
    const dbName = "tab/" + tabId;
    const remoteDbLocation =
      config.backendUrl + "/" + encodeURIComponent(dbName);

    const db = new PouchDB(remoteDbLocation, { skip_setup: true });

    return db.get("info");
  }

  async connectTab(id: string) {
    const db = this.initDb(id);

    const docs = await db.connect();
    return {
      createOrUpdate: this.docsToEntities(id, docs),
      delete: [],
    };
  }

  private getAllDbs(): { tabId: string; db: Tab }[] {
    const allDbs = [];
    for (const dbName in this.dbs) {
      allDbs.push({
        tabId: dbName,
        db: this.dbs[dbName],
      });
    }
    return allDbs;
  }

  private initDbs(): void {
    const tabIds = loadTabIds();
    tabIds.forEach((tabId) => this.initDb(tabId));
  }

  private initDb(tabId: string): Tab {
    if (this.dbs[tabId]) {
      throw new Error(`DB "${tabId}" already initialized.`);
    }
    const dbName = "tab/" + tabId;
    const remoteDbLocation =
      config.backendUrl + "/" + encodeURIComponent(dbName);
    const tab = new Tab(
      dbName,
      remoteDbLocation,
      this.handleChanges.bind(this, tabId),
      this.isIndexedDbAvailable === false ? "memory" : undefined
    );
    this.dbs[tabId] = tab;
    addTabId(tabId);
    return tab;
  }

  private handleChanges(
    tabId: string,
    changes: PouchDB.Core.ChangesResponseChange<Document>[]
  ) {
    const createOrUpdate = changes
      .filter((change) => !change.deleted)
      .map((change) => this.docToEntity(tabId, change.doc!));

    const delete_ = changes
      .filter((change) => change.deleted)
      .map((change) => this.docToEntity(tabId, change.doc!));

    if (!this.onChanges) {
      throw new Error("Callback not set.");
    }

    this.onChanges({
      createOrUpdate,
      delete: delete_,
    });
  }

  entityToDoc(entity: Entity): Document {
    const doc: any = { ...entity };

    doc._id = doc.id;
    delete doc.id;
    delete doc.tabId;

    return doc as Document;
  }

  docsToEntities(tabId: string, docs: Document[]): Entity[] {
    return docs.map(this.docToEntity.bind(this, tabId));
  }

  docToEntity(tabId: string, doc: Document): Entity {
    const docCopy = { ...doc } as { [key: string]: unknown };
    delete docCopy._rev;
    delete docCopy._id;
    const newEntity: Partial<Entity> = {
      id: doc._id,
      tabId,
    };
    return {
      ...docCopy,
      ...newEntity,
    } as Entity;
  }
}
