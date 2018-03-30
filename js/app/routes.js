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
        var tabId = getState().location.payload.tabId;

        actionCreators.ensureConnectedDb()(dispatch, getState)
        .then(function () {
          var tabExistsLocally = false;
          var tabs = getState().app.tabs;
          for (var i = 0; i < tabs.length; ++i) {
            if (tabs[i] === tabId) {
              tabExistsLocally = true;
              break;
            }
          }
  
          if (tabExistsLocally) {
            setTitle(selector(getState()).tabName);
          } else {
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
          var state = getState();
          var transaction = state.app.docsById[state.location.payload.transactionId];
          setTitle(selector(getState()).tabName + ': ' + transaction.description);
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
