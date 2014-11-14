require.config({
  paths: {
    react: '../bower_components/react/react',
    pouchdb: '../bower_components/pouchdb/dist/pouchdb'
  }
});

require(['app/app'], function (app) {
  'use strict';
  app.init();
});
