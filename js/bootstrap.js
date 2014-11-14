require.config({
  paths: {
    react: '../bower_components/react/react',
    pouchdb: '../bower_components/pouchdb/dist/pouchdb',
    fastclick: '../bower_components/fastclick/lib/fastclick'
  }
});

require(['fastclick', 'app/app'], function (FastClick, app) {
  'use strict';
  new FastClick(document.body);
  app.init();
});
