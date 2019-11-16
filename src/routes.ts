import actionCreators from './redux/actioncreators';
import { AllState } from "./";

function checkTabLocally (state: AllState) {
  var tabId = state.location.payload.tabId;
  var tabs = state.app.tabs;
  for (var i = 0; i < tabs.length; ++i) {
    if (tabs[i] === tabId) {
      return true;
    }
  }

  return false;
}

function tabThunk (dispatch: (action: any) => Promise<void>, getState: () => AllState) {
  dispatch(actionCreators.ensureConnectedDb())
  .then(function () {
    if (!checkTabLocally(getState())) {
      var tabId = getState().location.payload.tabId;
      dispatch(actionCreators.importTabFromUrl(tabId));
    }
  });
}

export default {
  ROUTE_TABS: {
    path: '/',
    thunk: function (dispatch: (action: any) => Promise<void>) {
      dispatch(actionCreators.ensureConnectedDb());
    }
  },

  ROUTE_TAB: {
    path: '/tabs/:tabId',
    thunk: tabThunk
  },

  ROUTE_NEW_TRANSACTION: {
    path: '/tabs/:tabId/transactions/create',
    thunk: tabThunk
  },

  ROUTE_TRANSACTION: {
    path: '/tabs/:tabId/transactions/:transactionId',
    thunk: tabThunk
  },

  ROUTE_CATCH_ALL: {
    path: '*',
    thunk: function (dispatch: (action: any) => Promise<void>) {
      dispatch(actionCreators.navigateToTabs());
    }
  }

};
