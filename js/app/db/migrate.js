define([
  'pouchdb'
],

function (PouchDB) {
  'use strict';

  // replicate database to new indexeddb database and destroy it
  // https://pouchdb.com/2018/01/23/pouchdb-6.4.2.html
  function migrate (name) {
    return new Promise(function (resolve, reject) {
      var localDb = new PouchDB(name);
      localDb.info()
      /* eslint-disable consistent-return */
      .then(function (info) {
        if (info.adapter !== 'websql') {
          return resolve(localDb);
        }
        console.log('migrating "' + name + '"…');
        var newDb = new PouchDB(name, {
          adapter: 'idb'
        });
        var replicate = localDb.replicate.to(newDb);
        replicate
        .then(function () {
          localStorage.removeItem('_pouch__websqldb__pouch_' + name);
          console.log('migrating "' + name + '" done.');
          resolve(newDb);
        })
        .catch(reject);
      })
      /* eslint-enable consistent-return */
      .catch(reject);
    });
  }

  return function () {
    return (
      migrate('pouch__all_dbs__')
      .then(function () {
        return PouchDB.allDbs();
      })
      .then(function (dbNames) {
        return Promise.all(dbNames.map(migrate));
      })
    );
  };

 });
