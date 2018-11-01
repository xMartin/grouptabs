(function () {
  'use strict';

  require.config({
    paths: {
      react: '../node_modules/react/umd/react.development',
      'react-dom': '../node_modules/react-dom/umd/react-dom.development',
      'create-react-class': '../node_modules/create-react-class/create-react-class',
      'pure-render-mixin': '../node_modules/react-addons-pure-render-mixin/react-addons-pure-render-mixin',
      'prop-types': '../node_modules/prop-types/prop-types',
      redux: '../node_modules/redux/dist/redux',
      'react-redux': '../node_modules/react-redux/dist/react-redux',
      Reselect: '../node_modules/reselect/dist/reselect',
      'redux-thunk': '../node_modules/redux-thunk/dist/redux-thunk',
      pouchdb: '../node_modules/pouchdb/dist/pouchdb',
      'pouchdb.websql': '../node_modules/pouchdb/dist/pouchdb.websql',
      'pouchdb-all-dbs': '../node_modules/pouchdb-all-dbs/dist/pouchdb.all-dbs',
      uuid: '../node_modules/pure-uuid/uuid',
      lie: '../node_modules/lie/dist/lie',
      'smooth-scroll': '../node_modules/smooth-scroll/dist/smooth-scroll',
      'redux-first-router': '../node_modules/redux-first-router/dist/redux-first-router',
      'rudy-history': '../node_modules/rudy-history/umd/history'
    }
  });

  // apply promise polyfill
  // the promise library is not part of the build, load it asynchroneously
  if (!window.Promise) {
    var promiseLib = 'lie';
    require([promiseLib], function (Promise) {
      window.Promise = Promise;
      run();
    });
  } else {
    run();
  }

  function run () {
    require([
      'react-dom',
      'react',
      'redux',
      'react-redux',
      'redux-thunk',
      'app/redux/reducer',
      'app/app',
      'rudy-history',
      'app/util/standalone',
      'redux-first-router',
      'app/routes'
    ],
    function (ReactDOM, React, Redux, ReactRedux, ReduxThunk, appReducer, App, History, Standalone, ReduxFirstRouter, routes) {
      Standalone.restoreLocation();

      var router = ReduxFirstRouter.connectRoutes(routes, {
        createHistory: History.createHashHistory
      });

      Standalone.startPersistingLocation(router.history);

      var rootReducer = Redux.combineReducers({location: router.reducer, app: appReducer});
      var middlewares = Redux.applyMiddleware(ReduxThunk.default, router.middleware);

      var compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
      var store = Redux.createStore(rootReducer, compose(router.enhancer, middlewares));

      var components = (
        React.createElement(ReactRedux.Provider, {store: store},
          React.createElement(App)
        )
      );

      ReactDOM.render(components, document.getElementById('root'));

      var unsubscribe = store.subscribe(function () {
        if (store.getState().app.initialLoadingDone) {
          hideAppLoader();
          unsubscribe();
        }
      });

      function hideAppLoader () {
        var loader = document.getElementById('loader');

        loader.classList.add('hidden');

        setTimeout(function () {
          loader.style.display = 'none';
        }, 500);
      }

    });
  }

})();
