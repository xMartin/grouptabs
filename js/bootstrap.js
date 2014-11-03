require.config({
  paths: {
    pouchdb: '../bower_components/pouchdb/dist/pouchdb',
    underscore: '../bower_components/underscore/underscore',
    ring: '../bower_components/ring/ring'
  }
});

require(['app/app'], function (app) {
  'use strict';
  app.init();
});
