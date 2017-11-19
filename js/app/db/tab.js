define([
  'pouchdb',
  '../lang/class',
  '../lang/iobject'
],

function (PouchDB, createClass, iobject) {
  'use strict';

  return createClass({

    syncInteral: 7500,

    constructor: function (localDbName, remoteDbLocation, changesCallback) {
      if (!localDbName || typeof localDbName !== 'string') {
        throw new Error('missing localDbName parameter');
      }

      if (!remoteDbLocation || typeof remoteDbLocation !== 'string') {
        throw new Error('missing remoteDbLocation parameter');
      }

      this.remoteDbLocation = remoteDbLocation;

      this._onChangesHandler = changesCallback;

      this.db = new PouchDB(localDbName);
      this.remoteDb = new PouchDB(remoteDbLocation);
    },

    connect: function (options) {
      options = options || {};

      var allDocs;

      return (
        this.replicateFromRemote()
        .then(this.fetchAll.bind(this))
        .then(function (docs) {
          allDocs = docs;
        })
        .then(function () {
          return this.db.info();
        }.bind(this))
        .then(function (info) {
          this._lastSequenceNumber = info.update_seq;
        }.bind(this))
        .then(function () {
          if (options.continuous) {
            return this.startSyncing({delayed: true});
          }
        }.bind(this))
        .then(function () {
          return allDocs;
        })
      );
    },

    createDoc: function (doc) {
      if (doc._id) {
        return (
          this.db.put(doc)
          .then(function (response) {
            console.log('db: put doc (created)', response);
          })
        );
      }

      return (
        this.db.post(doc)
        .then(function (response) {
          console.log('db: posted doc', response);
        })
      );
    },

    updateDoc: function (doc) {
      return (
        this.db.get(doc._id)
        .then(function (fetchedDoc) {
          return iobject.merge(doc, {_rev: fetchedDoc._rev});
        })
        .then(this.db.put.bind(this.db))
        .then(function (response) {
          console.log('db: put doc (updated)', response);
        })
      );
    },

    deleteDoc: function (id) {
      return (
        this.db.get(id)
        .then(function (fetchedDoc) {
          return {
            _id: id,
            _rev: fetchedDoc._rev,
            _deleted: true
          };
        })
        .then(this.db.put.bind(this.db))
        .then(function (response) {
          console.log('db: deleted doc', response);
        })
      );
    },

    replicateFromRemote: function () {
      var dbName = this.db.name;

      console.info('replication from remote start', dbName);

      return new Promise(function (resolve) {
        this.db.replicate.from(this.remoteDb, {
          batch_size: 100
        })
        .on('paused', function () {
          console.info('replication from remote paused', dbName);
        })
        .on('active', function () {
          console.info('replication from remote active', dbName);
        })
        .on('complete', function () {
          console.info('replication from remote complete', dbName);
          resolve();
        })
        .on('error', function (err) {
          console.error('replication from remote error', dbName, err);
          // resolve even in error case
          // incomplete replication can be handled by next sync
          resolve();
        });
      }.bind(this));
    },

    fetchAll: function () {
      return this.db.allDocs({
        include_docs: true,
        attachments: true
      })
      .then(function (result) {
        return result.rows.map(function (row) {
          return row.doc;
        });
      });
    },

    setSyncState: function (state) {
      this.syncState = state;

      if (state === 'complete' && this.shouldStopSyncingWhenSynced) {
        this.stopSyncing();
        this.shouldStopSyncingWhenSynced = false;
      }
    },

    startSyncing: function (options) {
      options = options || {};

      if (!options.delayed) {
        this.sync();
      }

      this._startSyncInterval();
    },

    stopSyncing: function () {
      this._syncHandle.cancel();
      clearInterval(this._syncIntervalHandle);
    },

    stopSyncingWhenSynced: function () {
      if (this.syncState === 'complete') {
        this.stopSyncing();
      } else {
        this.shouldStopSyncingWhenSynced = true;
      }
    },

    /**
     * This sets up replication between the local database
     * and its remote counterpart
     */
    sync: function () {
      console.info('sync start', this.db.name);
      this.setSyncState('active');

      this._isSyncing = true;
      this._syncHandle = this.db.sync(this.remoteDb, {
        batch_size: 100
      })
      .on('error', function (err) {
        console.error('sync error', this.db.name, err);
        this._isSyncing = false;
        this._emitChanges();
        this.setSyncState('error');
      }.bind(this))
      .on('complete', function () {
        console.info('sync complete', this.db.name);
        this._isSyncing = false;
        this._emitChanges();
        this.setSyncState('complete');
      }.bind(this));
    },

    _startSyncInterval: function () {
      this._syncIntervalHandle = setInterval(function () {
        if (!this._isSyncing) {
          this.sync();
        }
      }.bind(this), this.syncInteral);
    },

    _emitChanges: function () {
      this.db.changes({
        since: this._lastSequenceNumber,
        include_docs: true
      })
      .on('complete', function (info) {
        this._lastSequenceNumber = info.last_seq;

        if (!info.results.length) {
          return;
        }

        console.info('db changes', info.results);
        this._onChangesHandler(info.results);
      }.bind(this))
      .on('error', console.error.bind(console));
    },

    /**
     * removes local database without triggering
     * events on objects.
     */
    destroy: function () {
      this.stopSyncing();
      this.db.destroy();
    }

  });

});
