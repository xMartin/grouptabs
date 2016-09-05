require.config({
  paths: {
    react: '../node_modules/react/dist/react',
    'react-dom': '../node_modules/react-dom/dist/react-dom',
    pouchdb: '../node_modules/pouchdb/dist/pouchdb',
    'pouchdb-all-dbs': '../node_modules/pouchdb-all-dbs/dist/pouchdb.all-dbs',
    fastclick: '../node_modules/fastclick/lib/fastclick'
  }
});

require(['fastclick', 'react-dom', 'react', 'app/app'], function (FastClick, ReactDOM, React, App) {
  'use strict';

  new FastClick(document.body);

  ReactDOM.render(React.createElement(App), document.getElementById('scenes'));
});
