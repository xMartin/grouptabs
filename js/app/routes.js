define([
  'app/redux/actioncreators'
],

function (actionCreators) {
  'use strict';

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
        dispatch(actionCreators.ensureConnectedDb());
      }
    },

    ROUTE_TAB: {
      path: '/tabs/:tabId',
      thunk: function (dispatch, getState) {

        dispatch(actionCreators.ensureConnectedDb())
        .then(function () {
          if (!checkTabLocally(getState())) {
            var tabId = getState().location.payload.tabId;
            dispatch(actionCreators.importTabFromUrl(tabId));
          }
        })
        .catch(console.error.bind(console));
      }
    },

    ROUTE_NEW_TRANSACTION: {
      path: '/tabs/:tabId/transactions/create',
      thunk: function (dispatch) {
        dispatch(actionCreators.ensureConnectedDb());
      }
    },

    ROUTE_TRANSACTION: {
      path: '/tabs/:tabId/transactions/:transactionId',
      thunk: function (dispatch, getState) {
        dispatch(actionCreators.ensureConnectedDb())
        .then(function () {
          if (!checkTabLocally(getState())) {
            var tabId = getState().location.payload.tabId;
            dispatch(actionCreators.importTabFromUrl(tabId));
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
