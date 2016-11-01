define([
  'pouchdb',
  'pouchdb-all-dbs',
  './tab'
],

function (PouchDB, allDbs, Tab) {
  'use strict';

  var Manager = function (callback) {
    this.dbs = {};
    this._changesCallback = callback;

    allDbs(PouchDB);
  };

  Object.assign(Manager.prototype, {

    init: function () {
      return this.initDbs();
    },

    connect: function () {
      Promise.all(this.getAllDbs().map(function (db) {
        return (
          db.db.connect()
          .then(this.transformDocs.bind(this, db.tabId))
        );
      }.bind(this)))
      .then(function (docsPerDb) {
        var flat = [];
        docsPerDb.forEach(function (docs) {
          flat = flat.concat(docs);
        });
        return flat;
      })
      .then(function (docs) {
        this._changesCallback({
          createOrUpdate: docs,
          delete: []
        });
      }.bind(this))
      .catch(console.error.bind(console));
    },

    createDoc: function (doc) {
      var dbDoc = Object.assign({}, doc);

      if (doc.id) {
        dbDoc._id = doc.id;
        delete dbDoc.id;
      }

      delete dbDoc.tabId;

      return this.dbs[doc.tabId].createDoc(dbDoc);
    },

    updateDoc: function (doc) {
      var dbDoc = Object.assign({}, doc);

      dbDoc._id = doc.id;
      delete dbDoc.id;
      delete dbDoc.tabId;

      return this.dbs[doc.tabId].updateDoc(dbDoc);
    },

    deleteDoc: function (doc) {
      return this.dbs[doc.tabId].deleteDoc(doc.id);
    },

    createTab: function (doc) {
      var db = this.initDb('tab/' + doc.tabId);

      return (
        this.createDoc(doc)
        .then(db.startSyncing.bind(db))
      );
    },

    connectTab: function (id) {
      var db = this.initDb('tab/' + id);

      return (
        db.connect()
        .then(function (docs) {
          return {
            createOrUpdate: this.transformDocs(id, docs),
            delete: []
          };
        }.bind(this))
      );
    },

    /**
     * @return [{tabId: TAB_ID, db: db}]
     */
    getAllDbs: function () {
      var allDbs = [];
      for (var dbName in this.dbs) {
        allDbs.push({
          tabId: dbName,
          db: this.dbs[dbName]
        });
      }
      return allDbs;
    },

    initDbs: function () {
      return (
        PouchDB.allDbs()
        .then(function (dbNames) {
          return dbNames.map(this.initDb.bind(this));
        }.bind(this))
      );
    },

    initDb: function (dbName) {
      var remoteDbLocation = config.backendUrl + '/' + encodeURIComponent(dbName);
      var tabId = dbName.substring(4);  // strip "tab/"
      return this.dbs[tabId] = new Tab(dbName, remoteDbLocation, this._changesHandler.bind(this, tabId));
    },

    _changesHandler: function (tabId, changes) {
      var createOrUpdate = (
        changes
        .filter(function (change) {
          return !change.deleted;
        })
        .map(function (change) {
          return this.transformDoc(tabId, change.doc);
        }.bind(this))
      );

      var delete_ = (
        changes
        .filter(function (change) {
          return change.deleted;
        })
        .map(function (change) {
          return this.transformDoc(tabId, change.doc);
        }.bind(this))
      );

      this._changesCallback({
        createOrUpdate: createOrUpdate,
        delete: delete_
      });
    },

    transformDocs: function (tabId, docs) {
      return docs.map(this.transformDoc.bind(this, tabId));
    },

    transformDoc: function (tabId, dbDoc) {
      var doc = Object.assign({}, dbDoc);
      doc.id = doc._id;
      doc.tabId = tabId;
      delete doc._rev;
      delete doc._id;
      return doc;
    }

  });

  return Manager;

 });
