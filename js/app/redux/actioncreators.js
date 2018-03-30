define([
  'uuid',
  '../lang/iobject',
  '../db/manager'
],

function (UUID, iobject, DbManager) {
  'use strict';

  var db = new DbManager();

  function generateTabId() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < 7; ++i) {
      result += chars.substr(Math.floor(Math.random() * chars.length), 1);
    }
    return result;
  }

  function checkTab(dispatch, id, shouldNavigateToTab) {
    dispatch({
      type: 'CHECK_REMOTE_TAB'
    });

    return (
      db.checkTab(id)
      .then(function (infoDoc) {
        dispatch({
          type: 'IMPORT_TAB',
          doc: {
            id: 'info',
            type: 'info',
            name: infoDoc.name,
            tabId: id
          }
        });

        if (shouldNavigateToTab) {
          dispatch({
            type: 'ROUTE_TAB',
            payload: {
              tabId: id
            }
          });
        }

        db.connectTab(id)
        .then(function (actionMap) {
          dispatch({
            type: 'UPDATE_FROM_DB',
            actionMap: actionMap
          });
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

        dispatch({
          type: 'CHECK_REMOTE_TAB_FAILURE',
          error: message
        });

        console.error(error);
      })
    );
  }

  var actionCreators = {
    connectDb: function () {
      return function (dispatch) {
        return (
          db.init(function (actionMap) {
            dispatch({
              type: 'UPDATE_FROM_DB',
              actionMap: actionMap
            });
          })
          .then(db.connect.bind(db))
        );
      };
    },

    ensureConnectedDb: function () {
      return function (dispatch, getState) {
        if (getState().app.initialLoadingDone) {
          return Promise.resolve();
        }

        return dispatch(actionCreators.connectDb());
      };
    },

    createTab: function (name) {
      return function (dispatch) {
        var id = generateTabId();

        var doc = {
          id: 'info',
          type: 'info',
          name: name,
          tabId: id
        };

        dispatch({
          type: 'CREATE_TAB',
          doc: doc
        });

        db.createTab(doc)
        .catch(console.error.bind(console));

        dispatch(actionCreators.selectTab(id));
      };
    },

    selectTab: function (id) {
      return {
        type: 'ROUTE_TAB',
        payload: {
          tabId: id
        }
      };
    },

    importTab: function (id) {
      return function (dispatch) {
        id = id.toLowerCase();
        // accept the full URL as input, too, e.g. "https://app.grouptabs.net/#/tabs/qm2vnl2" -> "qm2vnl2" 
        id = id.replace(/.*?([a-z0-9]+$)/, '$1');

        checkTab(dispatch, id, true);
      };
    },

    importTabFromUrl: function (id) {
      return function (dispatch) {
        return checkTab(dispatch, id);
      };
    },

    navigateToTabs: function () {
      return {
        type: 'ROUTE_TABS'
      };
    },

    addTransaction: function (transaction) {
      return function (dispatch, getState) {
        var doc = iobject.merge(transaction, {
          id: new UUID(4).format(),
          type: 'transaction',
          tabId: getState().location.payload.tabId
        });

        dispatch({
          type: 'CREATE_OR_UPDATE_TRANSACTION',
          doc: doc
        });

        db.createDoc(doc)
        .catch(console.error.bind(console));

        var tabId = getState().location.payload.tabId;
        dispatch(actionCreators.selectTab(tabId));
      };
    },

    updateTransaction: function (transaction) {
      return function (dispatch, getState) {
        dispatch({
          type: 'CREATE_OR_UPDATE_TRANSACTION',
          doc: transaction
        });

        db.updateDoc(transaction)
        .catch(console.error.bind(console));

        var tabId = getState().location.payload.tabId;
        dispatch(actionCreators.selectTab(tabId));
      };
    },

    removeTransaction: function (doc) {
      return function (dispatch, getState) {
        dispatch({
          type: 'REMOVE_TRANSACTION',
          doc: doc
        });

        db.deleteDoc(doc)
        .catch(console.error.bind(console));

        var tabId = getState().location.payload.tabId;
        dispatch(actionCreators.selectTab(tabId));
      };
    },

    navigateToAddTransaction: function (tabId) {
      return {
        type: 'ROUTE_NEW_TRANSACTION',
        payload: {
          tabId: tabId
        }
      };
    },

    navigateToUpdateTransaction: function (tabId, transactionId) {
      return {
        type: 'ROUTE_TRANSACTION',
        payload: {
          tabId: tabId,
          transactionId: transactionId
        }
      };
    },

    closeTransaction: function () {
      return function (dispatch, getState) {
        dispatch({
          type: 'ROUTE_TAB',
          payload: {
            tabId: getState().location.payload.tabId
          }
        });
      };
    },

    setError: function (error, info) {
      return {
        type: 'SET_ERROR',
        error: error,
        info: info
      };
    }
  };

  return actionCreators;

});
