define([
  'pouchdb',
  'pouchdb-all-dbs',
  '../lang/class',
  '../lang/iobject',
  './tab',
  './migrate'
],

function (PouchDB, allDbs, createClass, iobject, Tab, migrateDbs) {
  'use strict';

  return createClass({

    constructor: function () {
      this.dbs = {};

      allDbs(PouchDB, {noCache: true});
    },

    init: function (callback) {
      this._changesCallback = callback;

      return (
        migrateDbs()
        .then(this.initDbs.bind(this))
      );
    },

    connect: function () {
      return (
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
        .then(this.initAllDbsListener.bind(this))
      );
    },

    initAllDbsListener: function () {
      setInterval(function () {
        var knownTabIds = Object.keys(this.dbs);
        PouchDB.allDbs()
        .then(function (dbNames) {
          var tabIds = dbNames.map(function (dbName) {
            return dbName.substring(4);  // strip "tab/"
          });
          var newTabIds = tabIds.filter(function (tabId) {
            return knownTabIds.indexOf(tabId) === -1;
          });
          newTabIds.forEach(function (tabId) {
            this.connectTab(tabId)
            .then(this._changesCallback.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this), 7500);
    },

    createDoc: function (doc) {
      var dbDoc = iobject.copy(doc);

      if (doc.id) {
        dbDoc._id = doc.id;
        delete dbDoc.id;
      }

      delete dbDoc.tabId;

      return this.dbs[doc.tabId].createDoc(dbDoc);
    },

    updateDoc: function (doc) {
      var dbDoc = iobject.copy(doc);

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

    checkTab: function (tabId) {
      var dbName = 'tab/' + tabId;
      var remoteDbLocation = window.config.backendUrl + '/' + encodeURIComponent(dbName);

      var db = new PouchDB(remoteDbLocation);

      return db.get('info');
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
      var remoteDbLocation = window.config.backendUrl + '/' + encodeURIComponent(dbName);
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
      var doc = iobject.copy(dbDoc);
      doc.id = doc._id;
      doc.tabId = tabId;
      delete doc._rev;
      delete doc._id;
      return doc;
    }

  });

 });
