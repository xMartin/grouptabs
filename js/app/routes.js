define([
  'app/redux/actioncreators'
],

function (actionCreators) {
  'use strict';

  function persistTabIdThunk (dispatch, getState) {
    var tabId = getState().location.payload.tabId;
    localStorage.setItem('tabId', tabId);
  }

  return {
    ROUTE_TABS: {
      path: '/',
      thunk: function () {
        localStorage.removeItem('tabId');
      }
    },

    ROUTE_TAB: {
      path: '/tabs/:tabId',
      thunk: function (dispatch, getState) {
        persistTabIdThunk(dispatch, getState);

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

    ROUTE_NEW_TRANSACTION: {
      path: '/tabs/:tabId/transactions/create',
      thunk: persistTabIdThunk
    },

    ROUTE_TRANSACTION: {
      path: '/tabs/:tabId/transactions/:transactionId',
      thunk: persistTabIdThunk
    }

  };

});
