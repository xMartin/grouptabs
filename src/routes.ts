import { navigateToTabs, ensureConnectedDb, importTabFromUrl, GTThunkAction } from './redux/actioncreators';
import { AllState } from "./";
import { RouteThunk, RoutesMap } from 'redux-first-router';

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

const tabThunk: RouteThunk<AllState> = async (dispatch, getState) => {
  const gtDispatch = dispatch as (action: GTThunkAction) => Promise<void>;
  await gtDispatch(ensureConnectedDb());
  if (!checkTabLocally(getState())) {
    var tabId = getState().location.payload.tabId;
    dispatch(importTabFromUrl(tabId));
  }
};

const routes: RoutesMap<{}, AllState> = {
  ROUTE_TABS: {
    path: '/',
    thunk: function (dispatch) {
      dispatch(ensureConnectedDb());
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
    thunk: function (dispatch) {
      dispatch(navigateToTabs());
    }
  }
};

export default routes;
