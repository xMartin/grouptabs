define([
  'app/redux/actioncreators'
],

function (actionCreators) {
  'use strict';

  return {
    ROUTE_TABS: {
      path: '/',
      thunk: actionCreators.ensureConnectedDb()
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
  
          if (!tabExistsLocally) {
            dispatch(actionCreators.importTabFromUrl(tabId))
            .catch(function () {
              dispatch(actionCreators.navigateToTabs());
            });
          }
        })
        .catch(console.error.bind(console));
      }
    },

    ROUTE_NEW_TRANSACTION: {
      path: '/tabs/:tabId/transactions/create',
      thunk: actionCreators.ensureConnectedDb()
    },

    ROUTE_TRANSACTION: {
      path: '/tabs/:tabId/transactions/:transactionId',
      thunk: actionCreators.ensureConnectedDb()
    }

  };

});
