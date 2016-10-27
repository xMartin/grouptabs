define(function () {
  'use strict';

  // immutable array helpers
  var iarray = {
    add: function (array, item) {
      array = array.slice();  // copy
      array.push(item);
      return array;
    },

    addUniq: function (array, item) {
      var index = array.indexOf(item);
      if (index !== -1) {
        return array;
      }

      return iarray.add(array, item);
    },

    remove: function (array, index) {
      array = array.slice();  // copy
      return array.splice(index, 1);
    },

    removeItem: function (array, item) {
      var index = array.indexOf(item);
      if (index === -1) {
        return array;
      }

      array = array.slice();  // copy
      return array.splice(index, 1);
    }
  };

  // immutable object helpers
  var iobject = {
    add: function (object, key, data) {
      object = Object.assign({}, object);  // copy
      object[key] = data;
      return object;
    },

    remove: function (object, key) {
      object = Object.assign({}, object);  // copy
      delete object[key];
      return object;
    }
  };

  function array2object (array) {
    var object = {};
    array.forEach(function (item) {
      object[item.id] = item;
    });
    return object;
  }

  var initialState = {
    loading: false,
    currentTab: null,
    tabsById: {},
    tabs: [],
    transactionsById: {},
    transactions: []
  };

  return function (state, action) {
    if (!state) {
      return initialState;
    }

    switch (action.type) {
      case 'CREATE_TAB':
        return Object.assign({}, state, {
          currentTab: action.tab.id,
          tabsById: iobject.add(state.tabsById, action.tab.id, action.tab),
          tabs: iarray.add(state.tabs, action.tab.id)
        });

      case 'NAVIGATE_TO_TABS':
        return Object.assign({}, state, {
          currentTab: null,
          transactionsById: {},
          transactions: []
        });

      case 'SELECT_TAB':
        return Object.assign({}, state, {
          loading: true,
          currentTab: action.id
        });

      case 'LOAD_TAB_SUCCESS':
        return Object.assign({}, state, {
          loading: false,
          transactionsById: array2object(action.transactions),
          transactions: action.transactions.map(function (transaction) {
            return transaction.id;
          })
        });

      case 'PUT_TRANSACTION':
        return Object.assign({}, state, {
          transactionsById: iobject.add(state.transactionsById, action.transaction.id, action.transaction),
          transactions: iarray.addUniq(state.transactions, action.transaction.id)
        });

      case 'REMOVE_TRANSACTION':
        return Object.assign({}, state, {
          transactionsById: iobject.remove(state.transactionsById, action.id),
          transactions: iarray.removeItem(action.id)
        });

      default:
        return state;
    }
  };

});
