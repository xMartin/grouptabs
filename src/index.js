import React from 'react';
import ReactDOM from 'react-dom';
import { connectRoutes } from 'redux-first-router';
import { createHashHistory } from 'rudy-history';
import { combineReducers, applyMiddleware, compose as reduxCompose, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { restoreLocation, startPersistingLocation } from './util/standalone';
import appReducer from './redux/reducer';
import App from './app';
import routes from './routes';
import * as serviceWorker from './serviceWorker';
import './index.css';

restoreLocation();

var router = connectRoutes(routes, {
    createHistory: createHashHistory
});

startPersistingLocation(router.history);

var rootReducer = combineReducers({location: router.reducer, app: appReducer});
var middlewares = applyMiddleware(ReduxThunk, router.middleware);

var compose = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || reduxCompose;
var store = createStore(rootReducer, compose(router.enhancer, middlewares));

var components = (
    React.createElement(Provider, {store: store},
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
