import * as reselect from 'reselect';

function createTransactionsByRecencyComparator (prefix) {
  return function (a, b) {
    a = prefix ? a[prefix] : a;
    b = prefix ? b[prefix] : b;

    // backwards compatibility: strip time info from format being used earlier
    var dateA = a.date.substring(0, 10);
    var dateB = b.date.substring(0, 10);

    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    } else {  // ===
      if (a.timestamp > b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    }
  };
}

function sortTransactions (transactions) {
  transactions = transactions.slice();  // copy

  // order transactions by date and timestamp descending
  return transactions.sort(createTransactionsByRecencyComparator());
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

function getTabIds (state) {
  return state.app.tabs;
}

function getDocsById (state) {
  return state.app.docsById;
}

function getCurrentTab (state) {
  return state.location.payload.tabId;
}

function getTransactionsByTab (state) {
  return state.app.transactionsByTab;
}

var getTabs = reselect.createSelector(
  [getTabIds, getDocsById, getTransactionsByTab],
  function (tabIds, docsById, transactionsByTab) {
    var tabs = tabIds.map(function (tabId) {
      var info = docsById['info-' + tabId];
      var transactionIds = transactionsByTab[tabId] || [];
      var transactions = transactionIds.map(function (transactionId) {
        return docsById[transactionId];
      });
      var mostRecentTransaction = sortTransactions(transactions)[0];
      return {
        id: tabId,
        name: info.name,
        mostRecentTransaction: mostRecentTransaction
      };
    });

    // sort tabs by most recent transaction or name
    var tabsWithTransactions = tabs.filter(function (tab) {
      return tab.mostRecentTransaction;
    })
    .sort(createTransactionsByRecencyComparator('mostRecentTransaction'));
    var tabsWithoutTransactions = tabs.filter(function (tab) {
      return !tab.mostRecentTransaction;
    })
    .sort(function (a, b) {
      return a < b ? -1 : 1;
    });

    return tabsWithTransactions.concat(tabsWithoutTransactions);
  }
);

var getTabName = reselect.createSelector(
  [getTabs, getCurrentTab],
  function (tabs, currentTab) {
    var tab;
    tabs.forEach(function (_tab) {
      if (_tab.id === currentTab) {
        tab = _tab;
      }
    });
    return tab ? tab.name : '';
  }
);

var getSortedTransactions = reselect.createSelector(
  [getDocsById, getCurrentTab, getTransactionsByTab],
  function (docsById, currentTab, transactionsByTab) {
    var transactionIds = transactionsByTab[currentTab] || [];
    var transactions = transactionIds.map(function (transactionId) {
      return docsById[transactionId];
    });
    return sortTransactions(transactions);
  }
);

var getAccounts = reselect.createSelector(
  [getSortedTransactions],
  function (transactions) {
    return transactions2Accounts(transactions);
  }
);

var getTotal = reselect.createSelector(
  [getSortedTransactions],
  function (transactions) {
    return (
      transactions
      .filter(function (transaction) {
        return transaction.transactionType === 'SHARED';
      })
      .reduce(function (total, transaction) {
        var transactionSum = transaction.participants.reduce(function (sum, participant) {
          return sum + participant.amount;
        }, 0);
        return total + transactionSum;
      }, 0)
    );
  }
);

export default {
  getTabs: getTabs,
  getTabName: getTabName,
  getTransactions: getSortedTransactions,
  getAccounts: getAccounts,
  getTotal: getTotal
};
