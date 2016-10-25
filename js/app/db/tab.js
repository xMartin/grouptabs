define([
  'pouchdb'
],

function (PouchDB) {
  'use strict';

  var Tab = function (tabId) {
    if (!tabId) {
      throw new Error('Tab DB constructor: tabId missing.');
    }

    this.tabId = tabId;
    this.dbName = 'tab/' + tabId;
  };

  Tab.prototype.init = function () {
    return this._setupDb();
  };

  Tab.prototype._setupDb = function () {
    this.db = new PouchDB(this.dbName);

    // create view and don't throw if it already exists
    var createTransationViewPromise = new Promise(function (resolve) {
      this.db.put({
        _id: '_design/document_type',
        views: {
          document_type: {
            map: function (doc) {
              emit(doc.document_type);
            }.toString()
          }
        },
        filters: {
          transaction: function (doc) {
            return doc.document_type === 'transaction';
          }.toString()
        }
      })
      .then(function () {
        console.log('db: view "document_type" created.');
        resolve();
      })
      .catch(function (err) {
        if (err.name === 'conflict') {
          console.log('db: view "document_type" exists.');
          resolve();
        } else {
          throw new Error(err);
        }
      });
    }.bind(this));

    var createInfoPromise = new Promise(function (resolve) {
      this.db.put({_id: 'info'})
      .then(function () {
        console.log('db: info created.');
        resolve();
      })
      .catch(function (err) {
        if (err.name === 'conflict') {
          console.log('db: info exists.');
          resolve();
        } else {
          throw new Error(err);
        }
      });
    }.bind(this));

    return Promise.all([createTransationViewPromise, createInfoPromise]);
  };

  Tab.prototype.sync = function () {
    this._sync();
  };

  Tab.prototype._sync = function () {
    var url = config.backendUrl + '/' + encodeURIComponent(this.dbName);
    this._syncHandle = this.db.sync(url, {live: true, retry: true})
    .on('error', function (err) {
      console.error(err);
    });
  };

  Tab.prototype.stopSyncing = function () {
    this._syncHandle && this._syncHandle.cancel();
  };

  Tab.prototype.getInfo = function () {
    return this.db.get('info');
  };

  Tab.prototype.getTransactions = function () {
    return (
      this.db.query('document_type', {key: 'transaction', include_docs: true})
      .then(function (response) {
        var transactions = [];
        response.rows.forEach(function (row) {
          transactions.push(row.doc);
        });
        return transactions;
      })
    );
  };

  Tab.prototype.saveInfo = function (doc) {
    return (
      this.db.get('info')
      .then(function (fetchedDoc) {
        return Object.assign(fetchedDoc, doc);
      })
      .then(this.db.put.bind(this.db))
      .then(function () {
        console.log('db: info updated.');
      })
    );
  };

  Tab.prototype.saveTransaction = function (doc) {
    doc.document_type = 'transaction';
    doc.tabId = this.tabId;

    if (doc._id) {
      return (
        this.db.put(doc)
        .then(function (response) {
          console.log('db: transaction updated', response);
        })
      );
    }

    return (
      this.db.post(doc)
      .then(function (response) {
        console.log('db: transaction created', response);
      })
    );
  };

  Tab.prototype.removeTransaction = function (doc) {
    doc._deleted = true;

    return (
      this.db.put(doc)
      .then(function (response) {
        console.log('db: delete', response);
      })
    );
  };

  Tab.prototype.setupChangesListener = function (listener) {
    return (
      this.db.info()
      .then(function (info) {
        this.db.changes({
          since: info.update_seq,
          filter: 'document_type/transaction',
          live: true
        }).on('change', listener);
      }.bind(this))
    );
  };

  Tab.prototype.destroy = function () {
    this.stopSyncing();
  };

  return Tab;

});
