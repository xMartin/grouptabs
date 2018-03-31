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
      'pouchdb-all-dbs': '../node_modules/pouchdb-all-dbs/dist/pouchdb.all-dbs',
      fastclick: '../node_modules/fastclick/lib/fastclick',
      uuid: '../node_modules/pure-uuid/uuid',
      lie: '../node_modules/lie/dist/lie',
      'smooth-scroll': '../node_modules/smooth-scroll/dist/js/smooth-scroll.polyfills',
      history: '../node_modules/history/umd/history',
      'redux-first-router': '../node_modules/redux-first-router/dist/redux-first-router'
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
      'fastclick',
      'react-dom',
      'react',
      'redux',
      'react-redux',
      'redux-thunk',
      'app/redux/reducer',
      'app/app',
      'history',
      'app/util/standalone',
      'redux-first-router',
      'app/routes'
    ],
    function (FastClick, ReactDOM, React, Redux, ReactRedux, ReduxThunk, appReducer, App, History, initStandaloneLocation, ReduxFirstRouter, routes) {
      /* jshint -W031 */
      new FastClick(document.body);
      /* jshint +W031 */

      var history = History.createHashHistory();

      // re-establish last visited location on iOS standalone web app
      initStandaloneLocation(history);

      var router = ReduxFirstRouter.connectRoutes(history, routes);

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
