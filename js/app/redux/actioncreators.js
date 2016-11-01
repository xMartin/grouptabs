define([
  'uuid',
  '../db/manager'
],

function (UUID, DbManager) {
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

    handleCreateNewTab: function (name) {
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

    handleTabChange: function (id) {
      localStorage.setItem('tabId', id);

      return {
        type: 'SELECT_TAB',
        id: id
      };
    },

    handleImportTab: function (id) {
      return function (dispatch) {
        localStorage.setItem('tabId', id);

        dispatch({
          type: 'SELECT_TAB',
          id: id
        });

        db.connectTab(id)
        .then(function (actionMap) {
          dispatch({
            type: 'UPDATE_FROM_DB',
            actionMap: actionMap
          });
        })
        .catch(console.error.bind(console));
      };
    },

    handleChangeTabClick: function () {
      localStorage.removeItem('tabId');

      return {
        type: 'NAVIGATE_TO_TABS'
      };
    },

    addTransaction: function (transaction) {
      return function (dispatch, getState) {
        var doc = Object.assign({}, transaction, {
          id: new UUID(4).format(),
          type: 'transaction',
          tabId: getState().currentTab
        });

        dispatch({
          type: 'PUT_DOC',
          doc: doc
        });

        db.createDoc(doc)
        .catch(console.error.bind(console));
      };
    },

    updateTransaction: function (transaction) {
      return function (dispatch) {
        dispatch({
          type: 'PUT_DOC',
          doc: transaction
        });

        db.updateDoc(transaction)
        .catch(console.error.bind(console));
      };
    },

    deleteDoc: function (doc) {
      return function (dispatch) {
        dispatch({
          type: 'DELETE_DOC',
          doc: doc
        });

        db.deleteDoc(doc)
        .catch(console.error.bind(console));
      };
    }
  };

});
