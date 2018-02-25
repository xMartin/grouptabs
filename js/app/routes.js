define([
  'app/redux/actioncreators'
],

function (actionCreators) {
  'use strict';

  return {
    ROUTE_TABS: '/',

    ROUTE_TAB: {
      path: '/tabs/:tabId',
      thunk: function (dispatch, getState) {
        var tabId = getState().location.payload.tabId;
        
        if (tabId) {
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
        }
      }
    },

    ROUTE_NEW_TRANSACTION: '/tabs/:tabId/transactions/create',

    ROUTE_TRANSACTION: '/tabs/:tabId/transactions/:transactionId',

  };

});
