define([
  'pouchdb'
],

function (PouchDB) {
  'use strict';

  var Database = function (localDbName, remoteDbLocation, changesCallback) {
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
  };

  Object.assign(Database.prototype, {

    connect: function () {
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
        .then(this.startSyncing.bind(this))
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
          return Object.assign({}, doc, {_rev: fetchedDoc._rev});
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
      console.info('replication start');

      return new Promise(function (resolve) {
        this.db.replicate.from(this.remoteDb, {
          batch_size: 100
        })
        .on('paused', function () {
          console.info('replication paused');
        })
        .on('active', function () {
          console.info('replication active');
        })
        .on('complete', function () {
          console.info('replication complete');
          resolve();
        })
        .on('error', function (err) {
          console.error('replication error', err);
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

    startSyncing: function () {
      this.sync();
      this._startSyncInterval();
    },

    /**
     * This sets up replication between the local database
     * and its remote counterpart
     */
    sync: function () {
      this._isSyncing = true;
      this.syncHandle = this.db.sync(this.remoteDb, {
        batch_size: 100
      })
      .on('error', function (err) {
        console.error('replication error', err);
        this._isSyncing = false;
        this._emitChanges();
      }.bind(this))
      .on('complete', function () {
        this._isSyncing = false;
        this._emitChanges();
      }.bind(this));
    },

    cancelSync: function () {
      this.syncHandle.cancel();
    },

    _startSyncInterval: function () {
      setInterval(function () {
        if (!this._isSyncing) {
          this.sync();
        }
      }.bind(this), 4000);
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
      this.cancelSync();
      this.db.destroy();
    }

  });

  return Database;

});
