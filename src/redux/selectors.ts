import * as reselect from 'reselect';
import { Transaction, Info, Account, TransactionType, Tab } from '../types';
import { AllState } from '..';

function createTransactionsByRecencyComparator (prefix?: string) {
  type PrefixedArg = {[id: string]: any};
  return function (a: Transaction | PrefixedArg, b: Transaction | PrefixedArg): number {
    a = prefix ? (a as PrefixedArg)[prefix] : a as Transaction;
    b = prefix ? (b as PrefixedArg)[prefix] : b as Transaction;

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

function sortTransactions (transactions: Transaction[]) {
  transactions = transactions.slice();  // copy

  // order transactions by date and timestamp descending
  return transactions.sort(createTransactionsByRecencyComparator());
}

function transactions2Accounts (transactions: Transaction[]): Account[] {
  var participants: {[name: string]: number} = {};
  transactions.forEach(function (transaction) {
    var share: number;
    var total = 0;
    transaction.participants.forEach(function (participant) {
      total += participant.amount || 0;
    });
    if (transaction.transactionType === 'DIRECT') {
      // Same data structure as SHARED.
      // Everyone who paid gets this amount added.
      // Everyone who received gets a the share between all receipients substracted.
      var joinedParticipants: Account[] = [];
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
    var resultObj = {
      participant,
      amount: participants[participant],
    };
    result.push(resultObj);
  }
  result.sort(function (a, b) {
    return a.amount < b.amount ? -1 : 1;
  });
  return result;
}

function getTabIds (state: AllState) {
  return state.app.tabs;
}

function getDocsById (state: AllState) {
  return state.app.docsById;
}

function getCurrentTab (state: AllState) {
  return state.location.payload.tabId;
}

function getTransactionsByTab (state: AllState) {
  return state.app.transactionsByTab;
}

var getTabs = reselect.createSelector(
  [getTabIds, getDocsById, getTransactionsByTab],
  function (tabIds, docsById, transactionsByTab) {
    var tabs: Tab[] = tabIds.map(function (tabId) {
      var info = docsById['info-' + tabId] as Info;
      var transactionIds = transactionsByTab[tabId] || [];
      var transactions = transactionIds.map(function (transactionId) {
        return docsById[transactionId] as Transaction;
      });
      var mostRecentTransaction = sortTransactions(transactions)[0];
      return {
        id: tabId,
        name: info.name,
        mostRecentTransaction
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
    var tab: Tab | undefined;
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
      return docsById[transactionId] as Transaction;
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
        return transaction.transactionType === TransactionType.SHARED;
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
  getTabs,
  getTabName,
  getTransactions: getSortedTransactions,
  getAccounts,
  getTotal,
};
