define([
  'Reselect'
],

function (reselect) {
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
      var share;
      var total = 0;
      transaction.participants.forEach(function (participant) {
        total += participant.amount || 0;
      });
      if (transaction.transactionType === 'DIRECT') {
        // Same data structure as SHARED.
        // Everyone who paid gets this amount added.
        // Everyone who received gets a the share between all receipients substracted.
        var joinedParticipants = [];
        transaction.participants.forEach(function (participant) {
          if (participant.amount) {
            var participantName = participant.participant;
            var storedAmount = participants[participantName] || 0;
            participants[participantName] = storedAmount + participant.amount;
          } else {
            joinedParticipants.push(participant);
          }
        });
        share = total / joinedParticipants.length;
        joinedParticipants.forEach(function (participant) {
          var participantName = participant.participant;
          var storedAmount = participants[participantName] || 0;
          var newAmount = storedAmount - share;
          participants[participantName] = newAmount;
        });
      } else {
        share = total / transaction.participants.length;
        transaction.participants.forEach(function (participant) {
          var amount = participant.amount || 0;
          var participantName = participant.participant;
          var storedAmount = participants[participantName] || 0;
          var newAmount = storedAmount - share + amount;
          participants[participantName] = newAmount;
        });
      }
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
  }

  function accounts2Participants (accounts) {
    return accounts.map(function (account) {
      return account.participant;
    });
  }

  function getTabs (state) {
    return state.tabs;
  }

  function getDocsById (state) {
    return state.docsById;
  }

  function getCurrentTab (state) {
    return state.currentTab;
  }

  function getTransactionsByTab (state) {
    return state.transactionsByTab;
  }

  return reselect.createSelector(
    [getTabs, getDocsById, getCurrentTab, getTransactionsByTab],
    function (tabIds, docsById, currentTab, transactionsByTab) {
      var tabs = tabIds.map(function (tabId) {
        var doc = docsById['info-' + tabId];
        return {
          id: tabId,
          name: doc.name
        };
      });

      var tab;
      tabs.forEach(function (_tab) {
        if (_tab.id === currentTab) {
          tab = _tab;
        }
      });
      var tabName = tab && tab.name || '';

      var transactionIds = transactionsByTab[currentTab] || [];
      var transactions = transactionIds.map(function (transactionId) {
        return docsById[transactionId];
      });
      transactions = sortTransactions(transactions);

      var accounts = transactions2Accounts(transactions);

      var participants = accounts2Participants(accounts);

      return {
        tabName: tabName,
        tabs: tabs,
        transactions: transactions,
        accounts: accounts,
        participants: participants
      };
    }
  );

});
