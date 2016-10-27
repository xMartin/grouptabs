define([
  '../db/tab'
],

function (TabDb) {
  'use strict';

  // TODO manage instance in a smarter way
  var tabDb;

  function generateTabId() {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyz';
    var result = '';
    for (var i = 0; i < 7; ++i) {
      result += chars.substr(Math.floor(Math.random() * chars.length), 1);
    }
    return result;
  }

  function loadTransactionsNowAndOnDbChange (tabId, dispatch) {
    tabDb = new TabDb(tabId);

    return(
      tabDb.init()
      .then(function () {
        tabDb.setupChangesListener(function () {
          tabDb.getTransactions()
          .then(function (transactions) {
            dispatch({
              type: 'LOAD_TAB_SUCCESS',
              transactions: transactions
            });
          })
          .catch(console.error.bind(console));
        });
        tabDb.sync();
      })
      .then(tabDb.getTransactions.bind(tabDb))
      .then(function (transactions) {
        dispatch({
          type: 'LOAD_TAB_SUCCESS',
          transactions: transactions
        });
      })
    );
  }

  return {
    handleCreateNewTab: function (name) {
      return function (dispatch) {
        var id = generateTabId();

        localStorage.setItem('tabId', id);

        dispatch({
          type: 'CREATE_TAB',
          tab: {
            id: id,
            name: name
          }
        });

        loadTransactionsNowAndOnDbChange(id, dispatch)
        .then(function () {
          tabDb.saveInfo({
            name: name
          });
        })
        .catch(console.error.bind(console));
      };
    },

    handleTabChange: function (id) {
      return function (dispatch) {
        localStorage.setItem('tabId', id);

        dispatch({
          type: 'SELECT_TAB',
          id: id
        });

        loadTransactionsNowAndOnDbChange(id, dispatch)
        .catch(console.error.bind(console));
      };
    },

    handleChangeTabClick: function () {
      tabDb.destroy();
      tabDb = null;

      localStorage.removeItem('tabId');

      return {
        type: 'NAVIGATE_TO_TABS'
      };
    },

    saveTransaction: function (transaction) {
      // save to db
      tabDb.saveTransaction(transaction)
      .catch(console.error.bind(console));

      // TODO do optimistic update
      // we're for now relying on pouch managing ids etc
      // transaction.id = new UUID(4).format();

      // return {
      //   type: 'PUT_TRANSACTION',
      //   transaction: transaction
      // };
    },

    removeTransaction: function (doc) {
      tabDb.removeTransaction(doc)
      .catch(console.error.bind(console));

      // TODO do optimistic update
      // we're for now relying on pouch managing ids etc
      // return {
      //   type: 'REMOVE_TRANSACTION',
      //   id: id
      // };
    }
  };

});
