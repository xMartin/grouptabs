import iarray from '../lang/iarray';
import iobject from '../lang/iobject';
import { ActionMap, Transaction, Info } from '../types';
import { Reducer } from 'redux';

interface AppState {
  initialLoadingDone: boolean;
  checkingRemoteTab: boolean;
  remoteTabError: string;
  importingTab: boolean,
  docsById: {[id: string]: Transaction | Info},
  tabs: string[],
  transactionsByTab: {[tabId: string]: string[]},
  error: any;
}

const initialState: AppState = {
  initialLoadingDone: false,
  checkingRemoteTab: false,
  remoteTabError: '',
  importingTab: false,
  docsById: {},
  tabs: [],
  transactionsByTab: {},
  error: null
};

function docsReducer (state: AppState, actionMap: ActionMap): AppState {
  var docsById = state.docsById;
  var tabs = state.tabs;
  var transactionsByTab = state.transactionsByTab;

  actionMap.delete.forEach(function (dbDoc) {
    var doc = docsById[dbDoc.id];

    if (!doc) {
      return;
    }

    docsById = iobject.remove(docsById, doc.id);

    var tabId = dbDoc.tabId;
    if (doc.type === 'transaction') {
      var transactions = transactionsByTab[tabId];
      transactionsByTab = iobject.set(transactionsByTab, tabId, iarray.removeItem(transactions, doc.id));
    }
  });

  actionMap.createOrUpdate.forEach(function (doc) {
    var tabId = doc.tabId;

    if (doc.type === 'info') {
      doc = iobject.merge(doc, {
        id: 'info-' + tabId
      });

      tabs = iarray.addUniq(tabs, tabId);
    }

    docsById = iobject.set(docsById, doc.id, doc);

    if (doc.type === 'transaction') {
      transactionsByTab = iobject.set(transactionsByTab, tabId, iarray.addUniq(transactionsByTab[tabId] || [], doc.id));
    }
  });

  return {
    ...state,
    docsById,
    tabs,
    transactionsByTab
  };
}

const reducer: Reducer<AppState, any> = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_FROM_DB':
      return {
        ...docsReducer(state, action.actionMap),
        initialLoadingDone: true,
        importingTab: false
      };

    case 'CREATE_TAB':
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: []
        })
      };

    case 'CHECK_REMOTE_TAB':
      return {
        ...state,
        checkingRemoteTab: true,
        remoteTabError: initialState.remoteTabError
      };

    case 'CHECK_REMOTE_TAB_FAILURE':
      return {
        ...state,
        checkingRemoteTab: false,
        remoteTabError: action.error
      };

    case 'IMPORT_TAB':
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: []
        }),
        checkingRemoteTab: false,
        remoteTabError: initialState.remoteTabError,
        importingTab: true
      };

    case 'CREATE_OR_UPDATE_TRANSACTION':
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: []
        })
      };

    case 'REMOVE_TRANSACTION':
      return {
        ...docsReducer(state, {
          createOrUpdate: [],
          delete: [action.doc]
        })
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: {
          error: action.error,
          info: action.info
        }
      };

    case 'ROUTE_TABS':
    case 'ROUTE_TAB':
      return {
        ...state,
        remoteTabError: initialState.remoteTabError
      };

    default:
      return state;
  }
};

export default reducer;