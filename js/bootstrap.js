require.config({
  paths: {
    react: '../node_modules/react/dist/react',
    'react-dom': '../node_modules/react-dom/dist/react-dom',
    redux: '../node_modules/redux/dist/redux',
    'react-redux': '../node_modules/react-redux/dist/react-redux',
    'redux-thunk': '../node_modules/redux-thunk/dist/redux-thunk',
    pouchdb: '../node_modules/pouchdb/dist/pouchdb',
    'pouchdb-all-dbs': '../node_modules/pouchdb-all-dbs/dist/pouchdb.all-dbs',
    fastclick: '../node_modules/fastclick/lib/fastclick'
  }
});

require([
  'fastclick',
  'react-dom',
  'react',
  'redux',
  'react-redux',
  'redux-thunk',
  'app/redux/reducer',
  'app/redux/actioncreators',
  'pouchdb',
  'pouchdb-all-dbs',
  'app/app'
],
function (FastClick, ReactDOM, React, Redux, ReactRedux, ReduxThunk, reducer, actionCreators, PouchDB, allDbs, App) {
  'use strict';

  new FastClick(document.body);

  allDbs(PouchDB);

  PouchDB.allDbs()
  .then(function (dbNames) {
    var tabDbNames = dbNames.filter(function (dbName) {
      return dbName.indexOf('tab/') === 0;
    });

    return Promise.all(
      tabDbNames.map(function (tabDbName) {
        var pouch = new PouchDB(tabDbName);
        return (
          pouch.get('info')
          .then(function (doc) {
            return {
              id: tabDbName.substring(4),  // remove 'tab/' prefix
              name: doc.name
            };
          })
        );
      })
    );
  })
  .then(function (tabs) {
    var tabsById = {};
    tabs.forEach(function (tab) {
      tabsById[tab.id] = tab;
    });

    tabs = Object.keys(tabsById);

    var store = Redux.createStore(
      reducer,
      {
        loading: false,
        currentTab: null,
        tabsById: tabsById,
        tabs: tabs,
        transactionsById: {},
        transactions: []
      },
      Redux.applyMiddleware(ReduxThunk.default)
    );
    window.store = store;

    var initialTab = localStorage.getItem('tabId');
    if (initialTab) {
      store.dispatch(actionCreators.handleTabChange(initialTab));
    }

    var components = (
      React.createElement(ReactRedux.Provider, {store: store},
        React.createElement(App)
      )
    );

    ReactDOM.render(components, document.getElementById('scenes'));
  })
  .catch(console.error.bind(console));
});
