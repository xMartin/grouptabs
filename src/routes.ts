import {
  navigateToTabs,
  ensureConnectedDb,
  importTabFromUrl,
  GTThunkAction,
  initTransactionForm,
} from "./redux/actioncreators";
import { AllState } from "./";
import { RouteThunk, RoutesMap } from "redux-first-router";
import { loadTabIds } from "./db/tabidpersistor";

function checkTabLocally(state: AllState) {
  const tabId = state.location.payload.tabId;
  const tabs = loadTabIds();
  return tabs.includes(tabId);
}

const tabThunk: RouteThunk<AllState> = async (dispatch, getState) => {
  const gtDispatch = dispatch as (action: GTThunkAction) => Promise<void>;
  await gtDispatch(ensureConnectedDb());
  if (!checkTabLocally(getState())) {
    var tabId = getState().location.payload.tabId;
    await dispatch(importTabFromUrl(tabId));
  }
};

const routes: RoutesMap<{}, AllState> = {
  ROUTE_TABS: {
    path: "/",
    thunk: function (dispatch) {
      dispatch(ensureConnectedDb());
    },
  },

  ROUTE_TAB: {
    path: "/tabs/:tabId",
    thunk: tabThunk,
  },

  ROUTE_NEW_TRANSACTION: {
    path: "/tabs/:tabId/transactions/create",
    thunk: async (dispatch, getState) => {
      await tabThunk(dispatch, getState);
      dispatch(initTransactionForm());
    },
  },

  ROUTE_TRANSACTION: {
    path: "/tabs/:tabId/transactions/:transactionId",
    thunk: async (dispatch, getState) => {
      await tabThunk(dispatch, getState);
      dispatch(initTransactionForm());
    },
  },

  ROUTE_CATCH_ALL: {
    path: "*",
    thunk: function (dispatch) {
      dispatch(navigateToTabs());
    },
  },
};

export default routes;
