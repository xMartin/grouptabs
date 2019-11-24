import uuidv4 from 'uuid/v4';
import iobject from '../lang/iobject';
import DbManager from '../db/manager'
import { AllState, Services } from '..';
import { Transaction, Info, ActionMap, DocumentType } from '../types';
import { ThunkAction } from 'redux-thunk';

export const CHECK_REMOTE_TAB = 'CHECK_REMOTE_TAB';
export const CHECK_REMOTE_TAB_FAILURE = 'CHECK_REMOTE_TAB_FAILURE';
export const CREATE_TAB = 'CREATE_TAB';
export const IMPORT_TAB = 'IMPORT_TAB';
export const UPDATE_FROM_DB = 'UPDATE_FROM_DB';
export const CREATE_OR_UPDATE_TRANSACTION = 'CREATE_OR_UPDATE_TRANSACTION';
export const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
export const SET_ERROR = 'SET_ERROR';
export const ROUTE_TAB = 'ROUTE_TAB';
export const ROUTE_TABS = 'ROUTE_TABS';
export const ROUTE_TRANSACTION = 'ROUTE_TRANSACTION';
export const ROUTE_NEW_TRANSACTION = 'ROUTE_NEW_TRANSACTION';

interface CheckRemoteTabAction {
  type: typeof CHECK_REMOTE_TAB;
}

const createCheckRemoteTabAction = (): CheckRemoteTabAction => ({
  type: CHECK_REMOTE_TAB
});

interface CheckRemoteTabFailureAction {
  type: typeof CHECK_REMOTE_TAB_FAILURE;
  error: string;
}

const createCheckRemoteTabFailureAction = (error: string): CheckRemoteTabFailureAction => ({
  type: CHECK_REMOTE_TAB_FAILURE,
  error
});

interface CreateTabAction {
  type: typeof CREATE_TAB;
  doc: Info;
}

const createCreateTabAction = (doc: Info): CreateTabAction => ({
  type: CREATE_TAB,
  doc
});

interface ImportTabAction {
  type: typeof IMPORT_TAB;
  doc: Info;
}

const createImportTabAction = (doc: Info): ImportTabAction => ({
  type: IMPORT_TAB,
  doc
});

interface UpdateFromDbAction {
  type: typeof UPDATE_FROM_DB;
  actionMap: ActionMap;
}

const createUpdateFromDbAction = (actionMap: ActionMap): UpdateFromDbAction => ({
  type: UPDATE_FROM_DB,
  actionMap
});

interface CreateOrUpdateTransactionAction {
  type: typeof CREATE_OR_UPDATE_TRANSACTION;
  doc: Transaction;
}

const createCreateOrUpdateTransactionAction = (doc: Transaction): CreateOrUpdateTransactionAction => ({
  type: CREATE_OR_UPDATE_TRANSACTION,
  doc
});

interface RemoveTransactionAction {
  type: typeof REMOVE_TRANSACTION;
  doc: Transaction;
}

const createRemoveTransactionAction = (doc: Transaction): RemoveTransactionAction => ({
  type: REMOVE_TRANSACTION,
  doc
});

interface SetErrorAction {
  type: typeof SET_ERROR;
  error: any;
  info: any;
}

export const setError = (error: any, info: any) => ({
  type: SET_ERROR,
  error,
  info
});

interface SelectTabAction {
  type: typeof ROUTE_TAB;
  payload: {tabId: string};
}

export const selectTab = (id: string): SelectTabAction => ({
  type: ROUTE_TAB,
  payload: {
    tabId: id
  }
});

interface NavigateToTabsAction {
  type: typeof ROUTE_TABS;
}

export const navigateToTabs = (): NavigateToTabsAction => ({
  type: ROUTE_TABS
});

interface NavigateToUpdateTransactionAction {
  type: typeof ROUTE_TRANSACTION;
  payload: {tabId: string, transactionId: string};
}

export const navigateToUpdateTransaction = (tabId: string, transactionId: string): NavigateToUpdateTransactionAction => ({
  type: ROUTE_TRANSACTION,
  payload: {
    tabId: tabId,
    transactionId: transactionId
  }
});

interface NavigateToAddTransactionAction {
  type: typeof ROUTE_NEW_TRANSACTION;
  payload: {tabId: string};
}

export const navigateToAddTransaction = (tabId: string): NavigateToAddTransactionAction => ({
  type: ROUTE_NEW_TRANSACTION,
  payload: {
    tabId: tabId
  }
});

export type GTAction = CheckRemoteTabAction | CheckRemoteTabFailureAction | CreateTabAction | ImportTabAction | UpdateFromDbAction | CreateOrUpdateTransactionAction | RemoveTransactionAction | SetErrorAction | SelectTabAction | NavigateToTabsAction | NavigateToUpdateTransactionAction | NavigateToAddTransactionAction;

export type GTThunkAction = ThunkAction<Promise<void>, AllState, Services, GTAction>;

const generateTabId = () => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = 0; i < 7; ++i) {
    result += chars.substr(Math.floor(Math.random() * chars.length), 1);
  }
  return result;
};

const checkTab = (dispatch: (action: GTThunkAction | GTAction) => void, id: string, dbManager: DbManager, shouldNavigateToTab?: boolean) => {
  dispatch(createCheckRemoteTabAction());

  return (
    dbManager.checkTab(id)
    .then(function (infoDoc) {
      dispatch(createImportTabAction({
        id: 'info',
        type: DocumentType.INFO,
        name: infoDoc.name,
        tabId: id
      }));

      if (shouldNavigateToTab) {
        dispatch(selectTab(id));
      }

      dbManager.connectTab(id)
      .then(function (actionMap) {
        dispatch(createUpdateFromDbAction(actionMap));
      })
      .catch(console.error.bind(console));
    })
    .catch(function (error) {
      var message;
      if (error.name === 'not_found') {
        message = 'Could not find a tab with the ID "' + id + '".';
      } else {
        message = 'Error: unable to import tab. Please try again.';
      }

      dispatch(createCheckRemoteTabFailureAction(message));

      console.error(error);
    })
  );
};

export const connectDb = (): GTThunkAction => async (dispatch, getState, { dbManager }) => {
  await dbManager.init((actionMap) => {
    dispatch(createUpdateFromDbAction(actionMap));
  });
  dbManager.connect();
};

export const ensureConnectedDb = (): GTThunkAction => async (dispatch, getState) => {
  if (getState().app.initialLoadingDone) {
    return;
  }

  return dispatch(connectDb());
};

export const createTab = (name: string): GTThunkAction => async (dispatch, getState, { dbManager }) => {
  const id = generateTabId();

  const doc: Info = {
    id: 'info',
    type: DocumentType.INFO,
    name: name,
    tabId: id
  };

  dispatch(createCreateTabAction(doc));
  dispatch(selectTab(id));

  await dbManager.createTab(doc);
};

export const importTab = (id: string): GTThunkAction => (dispatch, getState, { dbManager }) => {
  id = id.toLowerCase();
  // accept the full URL as input, too, e.g. "https://app.grouptabs.net/#/tabs/qm2vnl2" -> "qm2vnl2" 
  id = id.replace(/.*?([a-z0-9]+$)/, '$1');

  return checkTab(dispatch, id, dbManager, true);
};

export const importTabFromUrl = (id: string): GTThunkAction => (dispatch, getState, { dbManager }) => {
  return checkTab(dispatch, id, dbManager);
};

export const addTransaction = (transaction: Transaction): GTThunkAction => async (dispatch, getState, { dbManager }) => {
  const doc = iobject.merge(transaction, {
    id: uuidv4(),
    type: DocumentType.TRANSACTION,
    tabId: getState().location.payload.tabId
  }) as Transaction;

  dispatch(createCreateOrUpdateTransactionAction(doc));

  const tabId = getState().location.payload.tabId;
  dispatch(selectTab(tabId));

  await dbManager.createDoc(doc);
};

export const updateTransaction = (transaction: Transaction): GTThunkAction => async (dispatch, getState, { dbManager }) => {
  dispatch(createCreateOrUpdateTransactionAction(transaction));

  const tabId = getState().location.payload.tabId;
  dispatch(selectTab(tabId));

  await dbManager.updateDoc(transaction);
};

export const removeTransaction = (doc: Transaction): GTThunkAction => async (dispatch, getState, { dbManager }) => {
  dispatch(createRemoveTransactionAction(doc));

  var tabId = getState().location.payload.tabId;
  dispatch(selectTab(tabId));

  await dbManager.deleteDoc(doc);
};

export const closeTransaction = (): GTThunkAction => async (dispatch, getState) => {
  const tabId = getState().location.payload.tabId;
  dispatch(selectTab(tabId));
};
