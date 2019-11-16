import uuidv4 from 'uuid/v4';
import iobject from '../lang/iobject';
import DbManager from '../db/manager'
import { AllState } from '..';
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

type GTThunkAction = ThunkAction<Promise<void>, AllState, {}, GTAction>;

var db = new DbManager();

const generateTabId = () => {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  var result = '';
  for (var i = 0; i < 7; ++i) {
    result += chars.substr(Math.floor(Math.random() * chars.length), 1);
  }
  return result;
};

const checkTab = (dispatch: any, id: string, shouldNavigateToTab?: boolean) => {
  dispatch(createCheckRemoteTabAction());

  return (
    db.checkTab(id)
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

      db.connectTab(id)
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

export const connectDb = (): GTThunkAction => {
  return function (dispatch) {
    return (
      db.init(function (actionMap) {
        dispatch(createUpdateFromDbAction(actionMap));
      })
      .then(db.connect.bind(db))
    );
  };
};

export const ensureConnectedDb = (): GTThunkAction => {
  return function (dispatch, getState) {
    if (getState().app.initialLoadingDone) {
      return Promise.resolve();
    }

    return dispatch(connectDb());
  };
};

export const createTab = (name: string): GTThunkAction => {
  return function (dispatch) {
    var id = generateTabId();

    var doc: Info = {
      id: 'info',
      type: DocumentType.INFO,
      name: name,
      tabId: id
    };

    dispatch(createCreateTabAction(doc));
    dispatch(selectTab(id));

    return (
      db.createTab(doc)
      .catch(console.error.bind(console))
    );
  };
};

export const importTab = (id: string): GTThunkAction => {
  return function (dispatch) {
    id = id.toLowerCase();
    // accept the full URL as input, too, e.g. "https://app.grouptabs.net/#/tabs/qm2vnl2" -> "qm2vnl2" 
    id = id.replace(/.*?([a-z0-9]+$)/, '$1');

    return checkTab(dispatch, id, true);
  };
};

export const importTabFromUrl = (id: string): GTThunkAction => {
  return function (dispatch) {
    return checkTab(dispatch, id);
  };
};

export const addTransaction = (transaction: Transaction): GTThunkAction => {
  return function (dispatch, getState) {
    var doc = iobject.merge(transaction, {
      id: uuidv4(),
      type: DocumentType.TRANSACTION,
      tabId: getState().location.payload.tabId
    }) as Transaction;

    dispatch(createCreateOrUpdateTransactionAction(doc));

    var tabId = getState().location.payload.tabId;
    dispatch(selectTab(tabId));

    return (
      db.createDoc(doc)
      .catch(console.error.bind(console))  
    )
  };
};

export const updateTransaction = (transaction: Transaction): GTThunkAction => {
  return function (dispatch, getState) {
    dispatch(createCreateOrUpdateTransactionAction(transaction));

    var tabId = getState().location.payload.tabId;
    dispatch(selectTab(tabId));

    return (
      db.updateDoc(transaction)
      .catch(console.error.bind(console))  
    )
  };
};

export const removeTransaction = (doc: Transaction): GTThunkAction => {
  return function (dispatch, getState) {
    dispatch(createRemoveTransactionAction(doc));

    var tabId = getState().location.payload.tabId;
    dispatch(selectTab(tabId));

    return (
      db.deleteDoc(doc)
      .catch(console.error.bind(console))  
    )
  };
};

export const closeTransaction = (): GTThunkAction => {
  return async function (dispatch, getState) {
    const tabId = getState().location.payload.tabId;
    dispatch(selectTab(tabId));
  };
};
