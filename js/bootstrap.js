require.config({
  paths: {
    react: '../bower_components/react/react',
    pouchdb: '../bower_components/pouchdb/dist/pouchdb',
    'pouchdb-all-dbs': '../bower_components/pouchdb-all-dbs/dist/pouchdb.all-dbs',
    fastclick: '../bower_components/fastclick/lib/fastclick'
  }
});

require(['fastclick', 'app/app'], function (FastClick, app) {
  'use strict';
  new FastClick(document.body);
  app.init();
});
