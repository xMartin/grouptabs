define([
  'react-redux',
  './redux/actioncreators',
  './components/app'
],

function (ReactRedux, actionCreators, App) {
  'use strict';

  function sortTransactions (transactions) {
    transactions = transactions.slice();  // copy

    // order transactions by date and timestamp descending
    return transactions.sort(function (a, b) {
      if (a.date > b.date) {
        return -1;
      } else if (a.date < b.date) {
        return 1;
      } else {  // ===
        if (a.timestamp > b.timestamp) {
          return -1;
        } else {
          return 1;
        }
      }
    });
  }

  function transactions2Accounts (transactions) {
    var participants = {};
    transactions.forEach(function (transaction) {
      var total = 0;
      transaction.participants.forEach(function (participant) {
        total += participant.amount || 0;
      });
      var share = total / transaction.participants.length;
      transaction.participants.forEach(function (participant) {
        var amount = participant.amount || 0;
        var participantName = participant.participant;
        var storedAmount = participants[participantName] || 0;
        var newAmount = storedAmount - share + amount;
        participants[participantName] = newAmount;
      });
    });
    var result = [];
    for (var participant in participants) {
      var resultObj = {};
      resultObj.participant = participant;
      resultObj.amount = participants[participant];
      result.push(resultObj);
    }
    result.sort(function (a, b) {
      return a.amount < b.amount ? -1 : 1;
    });
    return result;
  };

  function accounts2Participants (accounts) {
    return accounts.map(function (account) {
      return account.participant;
    });
  }

  function mapStateToProps (state) {
    var tabs = state.tabs.map(function (tabId) {
      return state.tabsById[tabId];
    });

    var tab = tabs.find(function (tab) {
      return tab.id === state.currentTab;
    });
    var tabName = tab && tab.name || '';

    var transactions = state.transactions.map(function (transactionId) {
      return state.transactionsById[transactionId];
    });
    transactions = sortTransactions(transactions);

    var accounts = transactions2Accounts(transactions);

    var participants = accounts2Participants(accounts);

    return {
      tabId: state.currentTab,
      tabName: tabName,
      tabs: tabs,
      transactions: transactions,
      accounts: accounts,
      participants: participants
    };
  }

  function mapDispatchToProps (dispatch) {
    return {
      handleCreateNewTab: function (name) {
        dispatch(actionCreators.handleCreateNewTab(name));
      },

      handleTabChange: function (id) {
        dispatch(actionCreators.handleTabChange(id));
      },

      handleChangeTabClick: function () {
        dispatch(actionCreators.handleChangeTabClick());
      },

      saveTransaction: function (transaction) {
        actionCreators.saveTransaction(transaction);
      },

      removeTransaction: function (doc) {
        actionCreators.removeTransaction(doc);
      }
    };
  }

  return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);

});
