define([
  'app/redux/actioncreators',
  'app/redux/selector'
],

function (actionCreators, selector) {
  'use strict';

  var titleBase = 'Grouptabs';

  function setTitle (input) {
    document.title = input ? titleBase + ' – ' + input : titleBase;
  }

  function checkTabLocally (state) {
    var tabId = state.location.payload.tabId;
    var tabs = state.app.tabs;
    for (var i = 0; i < tabs.length; ++i) {
      if (tabs[i] === tabId) {
        return true;
      }
    }

    return false;
  }

  return {
    ROUTE_TABS: {
      path: '/',
      thunk: function (dispatch) {
        setTitle();
        dispatch(actionCreators.ensureConnectedDb());
      }
    },

    ROUTE_TAB: {
      path: '/tabs/:tabId',
      thunk: function (dispatch, getState) {

        dispatch(actionCreators.ensureConnectedDb())
        .then(function () {
          if (checkTabLocally(getState())) {
            setTitle(selector(getState()).tabName);
          } else {
            var tabId = getState().location.payload.tabId;
            dispatch(actionCreators.importTabFromUrl(tabId))
            .then(function () {
              setTitle(selector(getState()).tabName);
            });
          }
        })
        .catch(console.error.bind(console));
      }
    },

    ROUTE_NEW_TRANSACTION: {
      path: '/tabs/:tabId/transactions/create',
      thunk: function (dispatch, getState) {
        dispatch(actionCreators.ensureConnectedDb())
        .then(function () {
          setTitle(selector(getState()).tabName + ': New');
        });
      }
    },

    ROUTE_TRANSACTION: {
      path: '/tabs/:tabId/transactions/:transactionId',
      thunk: function (dispatch, getState) {
        dispatch(actionCreators.ensureConnectedDb())
        .then(function () {
          function setTransactionTitle (state) {
            var transaction = state.app.docsById[state.location.payload.transactionId];
            if (transaction) {
              setTitle(selector(state).tabName + ': ' + transaction.description);
            } else {
              // TODO Set title of imported tab transaction correctly
              // In the case of a tab just being imported, we currently don't know when we are
              // ready to access the description.
              setTitle(selector(state).tabName);
            }
          }

          if (checkTabLocally(getState())) {
            setTransactionTitle(getState());
          } else {
            var tabId = getState().location.payload.tabId;
            dispatch(actionCreators.importTabFromUrl(tabId))
            .then(function () {
              setTransactionTitle(getState());
            });
          }
        });
      }
    },

    ROUTE_CATCH_ALL: {
      path: '*',
      thunk: function (dispatch) {
        dispatch(actionCreators.navigateToTabs());
      }
    }

  };

});
