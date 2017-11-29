define([
  '../lang/iarray',
  '../lang/iobject'
],

function (iarray, iobject) {
  'use strict';

  function docsReducer (state, actionMap) {
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

    return iobject.merge(state, {
      docsById: docsById,
      tabs: tabs,
      transactionsByTab: transactionsByTab
    });
  }

  var HOME_VIEW = 'main';

  var initialState = {
    initialLoadingDone: false,
    checkingRemoteTab: false,
    remoteTabError: null,
    importingTab: false,
    currentTab: null,
    currentScene: 'tabs',
    currentTransaction: null,
    docsById: {},
    tabs: [],
    transactionsByTab: {},
    error: null
  };

  return function (state, action) {
    if (!state) {
      return initialState;
    }

    switch (action.type) {
      case 'UPDATE_FROM_DB':
        return iobject.merge(docsReducer(state, action.actionMap), {
          initialLoadingDone: true,
          importingTab: false
        });

      case 'CREATE_TAB':
        return iobject.merge(
          docsReducer(state, {
            createOrUpdate: [action.doc],
            delete: []
          }),
          {
            currentTab: action.doc.tabId,
            currentScene: HOME_VIEW
          }
        );

      case 'CHECK_REMOTE_TAB':
        return iobject.merge(state, {
          checkingRemoteTab: true,
          remoteTabError: initialState.remoteTabError
        });

      case 'CHECK_REMOTE_TAB_FAILURE':
        return iobject.merge(state, {
          checkingRemoteTab: false,
          remoteTabError: action.error
        });

      case 'IMPORT_TAB':
        return iobject.merge(
          docsReducer(state, {
            createOrUpdate: [action.doc],
            delete: []
          }),
          {
            currentTab: action.doc.tabId,
            currentScene: HOME_VIEW,
            checkingRemoteTab: false,
            remoteTabError: initialState.remoteTabError,
            importingTab: true
          }
        );

      case 'NAVIGATE_TO_TABS':
        return iobject.merge(state, {
          currentTab: null,
          currentScene: initialState.currentScene
        });

      case 'SELECT_TAB':
        return iobject.merge(state, {
          currentTab: action.id,
          currentScene: HOME_VIEW
        });

      case 'CREATE_OR_UPDATE_TRANSACTION':
        return iobject.merge(
          docsReducer(state, {
            createOrUpdate: [action.doc],
            delete: []
          }),
          {
            currentScene: HOME_VIEW,
            currentTransaction: initialState.currentTransaction
          }
        );

      case 'REMOVE_TRANSACTION':
        return iobject.merge(
          docsReducer(state, {
            createOrUpdate: [],
            delete: [action.doc]
          }),
          {
            currentScene: HOME_VIEW,
            currentTransaction: initialState.currentTransaction
          }
        );

      case 'NAVIGATE_TO_ADD_TRANSACTION':
        return iobject.merge(state, {
          currentScene: 'details'
        });

      case 'NAVIGATE_TO_UPDATE_TRANSACTION':
        return iobject.merge(state, {
          currentScene: 'details',
          currentTransaction: action.id
        });

      case 'NAVIGATE_TO_MAIN':
        return iobject.merge(state, {
          currentScene: HOME_VIEW
        });

      case 'CLOSE_TRANSACTION':
        return iobject.merge(state, {
          currentScene: HOME_VIEW,
          currentTransaction: initialState.currentTransaction
        });

      case 'SET_ERROR':
        return iobject.merge(state, {
          error: {
            error: action.error,
            info: action.info
          }
        });

      default:
        return state;
    }
  };

});
