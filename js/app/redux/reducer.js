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

  var initialState = {
    loading: false,
    currentTab: null,
    docsById: {},
    tabs: [],
    transactionsByTab: {}
  };

  return function (state, action) {
    if (!state) {
      return initialState;
    }

    switch (action.type) {
      case 'UPDATE_FROM_DB':
        return docsReducer(state, action.actionMap);

      case 'CREATE_TAB':
        return iobject.merge(
          docsReducer(state, {
            createOrUpdate: [action.doc],
            delete: []
          }),
          {
            currentTab: action.doc.tabId
          }
        );

      case 'NAVIGATE_TO_TABS':
        return iobject.merge(state, {
          currentTab: null
        });

      case 'SELECT_TAB':
        return iobject.merge(state, {
          currentTab: action.id
        });

      case 'PUT_DOC':
        return docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: []
        });

      case 'DELETE_DOC':
        return docsReducer(state, {
          createOrUpdate: [],
          delete: [action.doc]
        });

      default:
        return state;
    }
  };

});
