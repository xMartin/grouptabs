require.config({
  paths: {
    react: '../node_modules/react/dist/react',
    'react-dom': '../node_modules/react-dom/dist/react-dom',
    redux: '../node_modules/redux/dist/redux',
    'react-redux': '../node_modules/react-redux/dist/react-redux',
    'redux-thunk': '../node_modules/redux-thunk/dist/redux-thunk',
    pouchdb: '../node_modules/pouchdb/dist/pouchdb',
    'pouchdb-all-dbs': '../node_modules/pouchdb-all-dbs/dist/pouchdb.all-dbs',
    fastclick: '../node_modules/fastclick/lib/fastclick',
    uuid: '../node_modules/pure-uuid/uuid',
    lie: '../node_modules/lie/dist/lie'
  }
});

// apply promise polyfill
// the promise library is not part of the build, load it asynchroneously
if (!window.Promise) {
  var promiseLib = 'lie';
  require([promiseLib], function (Promise) {
    'use strict';

    window.Promise = Promise;
    run();
  });
} else {
  run();
}

function run () {
  'use strict';

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
    /* jshint -W031 */
    new FastClick(document.body);
    /* jshint +W031 */

    var store = Redux.createStore(
      reducer,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
      Redux.applyMiddleware(ReduxThunk.default)
    );

    var initialTab = localStorage.getItem('tabId');
    if (initialTab) {
      store.dispatch(actionCreators.handleTabChange(initialTab));
    }

    var components = (
      React.createElement(ReactRedux.Provider, {store: store},
        React.createElement(App)
      )
    );

    ReactDOM.render(components, document.getElementById('root'));

    store.dispatch(actionCreators.connectDb());
  });
}
