define([
  'uuid',
  '../lang/iobject',
  '../db/manager'
],

function (UUID, iobject, DbManager) {
  'use strict';

  // TODO manage instance in a smarter way
  var db;

  function generateTabId() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < 7; ++i) {
      result += chars.substr(Math.floor(Math.random() * chars.length), 1);
    }
    return result;
  }

  return {
    connectDb: function () {
      return function (dispatch) {
        db = new DbManager(function (actionMap) {
          dispatch({
            type: 'UPDATE_FROM_DB',
            actionMap: actionMap
          });
        });

        db.init()
        .then(db.connect.bind(db))
        .catch(console.error.bind(console));
      };
    },

    createTab: function (name) {
      return function (dispatch) {
        var id = generateTabId();

        localStorage.setItem('tabId', id);

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
      };
    },

    selectTab: function (id) {
      localStorage.setItem('tabId', id);

      return {
        type: 'SELECT_TAB',
        id: id
      };
    },

    importTab: function (id) {
      return function (dispatch) {
        dispatch({
          type: 'CHECK_REMOTE_TAB'
        });

        id = id.toLowerCase();

        db.checkTab(id)
        .then(function (infoDoc) {
          localStorage.setItem('tabId', id);

          dispatch({
            type: 'IMPORT_TAB',
            doc: {
              id: 'info',
              type: 'info',
              name: infoDoc.name,
              tabId: id
            }
          });

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
            message = 'Could not find a tab with this ID.';
          } else {
            message = 'Error: unable to import tab. Please try again.';
          }

          dispatch({
            type: 'CHECK_REMOTE_TAB_FAILURE',
            error: message
          });

          console.error(error);
        });
      };
    },

    navigateToTabs: function () {
      localStorage.removeItem('tabId');

      return {
        type: 'NAVIGATE_TO_TABS'
      };
    },

    addTransaction: function (transaction) {
      return function (dispatch, getState) {
        var doc = iobject.merge(transaction, {
          id: new UUID(4).format(),
          type: 'transaction',
          tabId: getState().currentTab
        });

        dispatch({
          type: 'CREATE_OR_UPDATE_TRANSACTION',
          doc: doc
        });

        db.createDoc(doc)
        .catch(console.error.bind(console));
      };
    },

    updateTransaction: function (transaction) {
      return function (dispatch) {
        dispatch({
          type: 'CREATE_OR_UPDATE_TRANSACTION',
          doc: transaction
        });

        db.updateDoc(transaction)
        .catch(console.error.bind(console));
      };
    },

    removeTransaction: function (doc) {
      return function (dispatch) {
        dispatch({
          type: 'REMOVE_TRANSACTION',
          doc: doc
        });

        db.deleteDoc(doc)
        .catch(console.error.bind(console));
      };
    },

    navigateToAddTransaction: function () {
      return {
        type: 'NAVIGATE_TO_ADD_TRANSACTION'
      };
    },

    navigateToUpdateTransaction: function (id) {
      return {
        type: 'NAVIGATE_TO_UPDATE_TRANSACTION',
        id: id
      };
    },

    navigateToList: function () {
      return {
        type: 'NAVIGATE_TO_LIST'
      };
    },

    navigateToMain: function () {
      return {
        type: 'NAVIGATE_TO_MAIN'
      };
    },

    closeTransaction: function () {
      return {
        type: 'CLOSE_TRANSACTION'
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

});
