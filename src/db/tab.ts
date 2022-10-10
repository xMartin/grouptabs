import PouchDB from "pouchdb-browser";
import debug, { Debugger } from "debug";

const log = debug("db:tab");

interface Content {
  _rev?: string;
  type: string;
  // ...
}
export type Document = PouchDB.Core.Document<Content>;
type Database = PouchDB.Database<Document>;
type ChangesHandler = (
  results: PouchDB.Core.ChangesResponseChange<Document>[]
) => void;

export default class Tab {
  private readonly db: Database;
  private readonly remoteDb: Database;

  private lastSequenceNumber?: number | string;
  private isSyncing?: boolean;

  private readonly logReplication: Debugger;
  private readonly logSync: Debugger;
  private readonly logDoc: Debugger;
  private readonly logChanges: Debugger;
  private readonly logFetch: Debugger;

  constructor(
    private readonly localDbName: string,
    private readonly remoteDbLocation: string,
    private readonly onChanges: ChangesHandler,
    adapter?: string
  ) {
    const myLog = log.extend(localDbName);
    this.logReplication = myLog.extend("replication");
    this.logSync = myLog.extend("sync");
    this.logDoc = myLog.extend("doc");
    this.logChanges = myLog.extend("changes");
    this.logFetch = myLog.extend("fetch");

    this.db = new PouchDB(localDbName, { adapter });
    this.remoteDb = new PouchDB(remoteDbLocation);
  }

  async connect({
    initialReplicationTimeout,
  }: { initialReplicationTimeout?: number } = {}) {
    await this.replicateFromRemote({ initialReplicationTimeout });
    const docs = await this.fetchAll();
    const info = await this.db.info();
    this.lastSequenceNumber = info.update_seq;
    this.startSyncing();
    return docs;
  }

  async createDoc(doc: Document) {
    if (doc._id) {
      const response = await this.db.put(doc);
      this.logDoc("put", "- response:", response);
      return;
    }

    const response = await this.db.post(doc);
    this.logDoc("post", "- response:", response);
  }

  async updateDoc(doc: Document) {
    const fetchedDoc = await this.db.get(doc._id);
    const docWithLatestRev = { ...doc, ...{ _rev: fetchedDoc._rev } };
    const response = await this.db.put(docWithLatestRev);
    this.logDoc("put", "- response:", response);
  }

  async deleteDoc(id: string) {
    const fetchedDoc = await this.db.get(id);
    const deleteDoc = {
      _id: id,
      _rev: fetchedDoc._rev,
      _deleted: true,
    };
    // for deleting we don't need a full document but `put` argument types require it
    const response = await this.db.put(
      deleteDoc as PouchDB.Core.PutDocument<Document>
    );
    this.logDoc("delete", "- response:", response);
  }

  private replicateFromRemote({
    initialReplicationTimeout,
  }: { initialReplicationTimeout?: number } = {}) {
    this.logReplication("start");

    return new Promise<void>((resolve) => {
      const replication = this.db.replicate
        .from(this.remoteDb, {
          batch_size: 100,
        })
        .on("paused", () => {
          this.logReplication("paused");
        })
        .on("active", () => {
          this.logReplication("active");
        })
        .on("complete", (info) => {
          // ignore complete event if cancelled
          if (info.status === "cancelled") {
            return;
          }
          this.logReplication("complete");
          clearTimeout(timeoutHandle);
          resolve();
        })
        .on("error", (err) => {
          this.logReplication("error", err);
          // resolve even in error case
          // incomplete replication can be handled by next sync
          clearTimeout(timeoutHandle);
          resolve();
        });
      let timeoutHandle: ReturnType<typeof setTimeout>;
      if (initialReplicationTimeout !== undefined) {
        timeoutHandle = setTimeout(() => {
          replication.cancel();
          this.logReplication("canceled (timeout)");
          resolve();
        }, initialReplicationTimeout);
      }
    });
  }

  private async fetchAll() {
    this.logFetch("all docs");
    const result = await this.db.allDocs({
      include_docs: true,
      attachments: true,
    });
    this.logFetch("all docs result", result);
    return result.rows.map((row) => row.doc);
  }

  startSyncing() {
    this.sync();
    this.startSyncInterval();
  }

  /**
   * This sets up replication between the local database
   * and its remote counterpart
   */
  private sync() {
    this.logSync("start");
    this.isSyncing = true;
    this.db
      .sync(this.remoteDb, {
        batch_size: 100,
      })
      .on("error", (err) => {
        this.logSync("error", err);
        this.isSyncing = false;
        this.emitChanges();
      })
      .on("complete", () => {
        this.logSync("complete");
        this.isSyncing = false;
        this.emitChanges();
      });
  }

  private startSyncInterval() {
    this.logSync("start interval");
    setInterval(() => {
      if (!this.isSyncing) {
        this.sync();
      }
    }, 7500);
  }

  private emitChanges() {
    this.db
      .changes<Document>({
        since: this.lastSequenceNumber,
        include_docs: true,
      })
      .on("complete", (info) => {
        this.lastSequenceNumber = info.last_seq;

        if (!info.results.length) {
          return;
        }

        this.logChanges("complete", info.results);
        this.onChanges(info.results);
      })
      .on("error", (error) => {
        throw new Error(error);
      });
  }
}
