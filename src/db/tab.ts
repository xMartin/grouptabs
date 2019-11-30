import PouchDB from 'pouchdb';

export type Document = PouchDB.Core.Document<Record<string, any> & {type: string}>;
type Database = PouchDB.Database<Document>;
type ChangesHandler = (results: PouchDB.Core.ChangesResponseChange<Document>[]) => void;

export default class {
  localDbName: string;
  remoteDbLocation: string;
  
  private _onChangesHandler: ChangesHandler;

  db: Database;

  remoteDb: Database;

  private _lastSequenceNumber?: number | string;

  private _isSyncing?: boolean;

  syncHandle: any;

  constructor(localDbName: string, remoteDbLocation: string, changesCallback: ChangesHandler) {
    this.localDbName = localDbName;
    this.remoteDbLocation = remoteDbLocation;

    this._onChangesHandler = changesCallback;

    this.db = new PouchDB(localDbName);
    this.remoteDb = new PouchDB(remoteDbLocation);
  }

  async checkIndexedDb() {
    try {
      await this.db.get('info');
    } catch (error) {
      if (error.name === 'indexed_db_went_bad') {
        console.info('Accessing IndexedDB failed. Falling back to in-memory.');
        this.db = new PouchDB(this.localDbName, {adapter: 'memory'});
      }
    }
  }

  async connect() {
    await this.checkIndexedDb();
    await this.replicateFromRemote();
    const docs = await this.fetchAll();
    const info = await this.db.info();
    this._lastSequenceNumber = info.update_seq;
    this.startSyncing();    
    return docs;
  }

  async createDoc(doc: Document) {
    if (doc._id) {
      const response = await this.db.put(doc);
      console.log('db: put doc (created)', response);
      return;
    }

    const response = await this.db.post(doc);
    console.log('db: posted doc', response);
  }

  async updateDoc(doc: Document) {
    const fetchedDoc = await this.db.get(doc._id);
    const docWithLatestRev = {...doc, ...{_rev: fetchedDoc._rev}};
    const response = await this.db.put(docWithLatestRev);
    console.log('db: put doc (updated)', response);
  }

  async deleteDoc(id: string) {
    const fetchedDoc = await this.db.get(id);
    const deleteDoc = {
      _id: id,
      _rev: fetchedDoc._rev,
      _deleted: true
    };
    // for deleting we don't need a full document but `put` argument types require it
    const response = await this.db.put(deleteDoc as PouchDB.Core.PutDocument<Document>);
    console.log('db: deleted doc', response);
  }

  replicateFromRemote() {
    console.info('replication start');

    return new Promise((resolve) => {
      this.db.replicate.from(this.remoteDb, {
        batch_size: 100
      })
      .on('paused', () => {
        console.info('replication paused');
      })
      .on('active', () => {
        console.info('replication active');
      })
      .on('complete', () => {
        console.info('replication complete');
        resolve();
      })
      .on('error', (err) => {
        console.error('replication error', err);
        // resolve even in error case
        // incomplete replication can be handled by next sync
        resolve();
      });
    });
  }

  async fetchAll() {
    const result = await this.db.allDocs({
      include_docs: true,
      attachments: true
    });
    return result.rows.map((row) => row.doc);
  }

  startSyncing() {
    this.sync();
    this._startSyncInterval();
  }

  /**
   * This sets up replication between the local database
   * and its remote counterpart
   */
  sync() {
    this._isSyncing = true;
    this.syncHandle = this.db.sync(this.remoteDb, {
      batch_size: 100
    })
    .on('error', (err) => {
      console.error('replication error', err);
      this._isSyncing = false;
      this._emitChanges();
    })
    .on('complete', () => {
      this._isSyncing = false;
      this._emitChanges();
    });
  }

  cancelSync() {
    this.syncHandle.cancel();
  }

  private _startSyncInterval() {
    setInterval(() => {
      if (!this._isSyncing) {
        this.sync();
      }
    }, 7500);
  }

  private _emitChanges() {
    this.db.changes<Document>({
      since: this._lastSequenceNumber,
      include_docs: true
    })
    .on('complete', (info) => {
      this._lastSequenceNumber = info.last_seq;

      if (!info.results.length) {
        return;
      }

      console.info('db changes', info.results);
      this._onChangesHandler(info.results);
    })
    .on('error', console.error.bind(console));
  }

  /**
   * removes local database without triggering
   * events on objects.
   */
  destroy() {
    this.cancelSync();
    this.db.destroy();
  }

}
