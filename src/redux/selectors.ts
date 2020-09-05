import { createSelector } from "reselect";
import { Account, Info, Tab, Transaction, TransactionType } from "../types";
import { AllState } from "..";
import { mapTransaction } from "../util/transaction";

function createTransactionsByRecencyComparator(prefix?: string) {
  type PrefixedArg = { [id: string]: any };
  return (
    a: Transaction | PrefixedArg,
    b: Transaction | PrefixedArg
  ): number => {
    a = prefix ? (a as PrefixedArg)[prefix] : (a as Transaction);
    b = prefix ? (b as PrefixedArg)[prefix] : (b as Transaction);

    // backwards compatibility: strip time info from format being used earlier
    const dateA = a.date.substring(0, 10);
    const dateB = b.date.substring(0, 10);

    if (dateA > dateB) {
      return -1;
    } else if (dateA < dateB) {
      return 1;
    } else {
      // ===
      if (a.timestamp > b.timestamp) {
        return -1;
      } else {
        return 1;
      }
    }
  };
}

function sortTransactions(transactions: Transaction[]) {
  transactions = transactions.slice(); // copy

  // order transactions by date and timestamp descending
  return transactions.sort(createTransactionsByRecencyComparator());
}

function transactions2Accounts(transactions: Transaction[]): Account[] {
  const participants: { [name: string]: number } = {};
  transactions.forEach((transaction) => {
    let share: number;
    let total = 0;
    transaction.participants.forEach(
      (participant) => (total += participant.amount || 0)
    );
    if (transaction.transactionType === "DIRECT") {
      // Same data structure as SHARED.
      // Everyone who paid gets this amount added.
      // Everyone who received gets a the share between all receipients substracted.
      const joinedParticipants: Account[] = [];
      transaction.participants.forEach((participant) => {
        if (participant.amount) {
          const participantName = participant.participant;
          const storedAmount = participants[participantName] || 0;
          participants[participantName] = storedAmount + participant.amount;
        } else {
          joinedParticipants.push(participant);
        }
      });
      share = total / joinedParticipants.length;
      joinedParticipants.forEach((participant) => {
        const participantName = participant.participant;
        const storedAmount = participants[participantName] || 0;
        const newAmount = storedAmount - share;
        participants[participantName] = newAmount;
      });
    } else {
      share = total / transaction.participants.length;
      transaction.participants.forEach((participant) => {
        const amount = participant.amount || 0;
        const participantName = participant.participant;
        const storedAmount = participants[participantName] || 0;
        const newAmount = storedAmount - share + amount;
        participants[participantName] = newAmount;
      });
    }
  });
  const result = [];
  for (const participant in participants) {
    const resultObj = {
      participant,
      amount: participants[participant],
    };
    result.push(resultObj);
  }
  result.sort((a, b) => (a.amount < b.amount ? -1 : 1));
  return result;
}

function getTabIds(state: AllState) {
  return state.app.tabs;
}

function getDocsById(state: AllState) {
  return state.app.docsById;
}

export function getCurrentTabId(state: AllState) {
  return state.location.payload.tabId;
}

function getTransactionsByTab(state: AllState) {
  return state.app.transactionsByTab;
}

export const getTabs = createSelector(
  [getTabIds, getDocsById, getTransactionsByTab],
  (tabIds, docsById, transactionsByTab) => {
    const tabs: Tab[] = tabIds.map((tabId) => {
      const info = docsById["info-" + tabId] as Info;
      const transactionIds = transactionsByTab[tabId] || [];
      const transactions = transactionIds.map(
        (transactionId) => docsById[transactionId] as Transaction
      );
      const mostRecentTransaction = sortTransactions(transactions)[0];
      return {
        id: tabId,
        info,
        mostRecentTransaction,
      };
    });

    // sort tabs by most recent transaction or name
    const tabsWithTransactions = tabs
      .filter((tab) => tab.mostRecentTransaction)
      .sort(createTransactionsByRecencyComparator("mostRecentTransaction"));
    const tabsWithoutTransactions = tabs
      .filter((tab) => !tab.mostRecentTransaction)
      .sort((a, b) => (a < b ? -1 : 1));

    return tabsWithTransactions.concat(tabsWithoutTransactions);
  }
);

export const getTabInfo = createSelector(
  [getTabs, getCurrentTabId],
  (tabs, currentTab) => {
    let tab: Tab | undefined;
    tabs.forEach((_tab) => {
      if (_tab.id === currentTab) {
        tab = _tab;
      }
    });
    return tab?.info;
  }
);

export const getTransactions = createSelector(
  [getDocsById, getCurrentTabId, getTransactionsByTab],
  (docsById, currentTab, transactionsByTab) => {
    const transactionIds = transactionsByTab[currentTab] || [];
    const transactions = transactionIds.map((transactionId) => {
      const transaction = docsById[transactionId] as Transaction;
      return mapTransaction(transaction);
    });
    return sortTransactions(transactions);
  }
);

export const getAccounts = createSelector([getTransactions], (transactions) =>
  transactions2Accounts(transactions)
);

export const getTotal = createSelector([getTransactions], (transactions) =>
  transactions
    .filter(
      (transaction) => transaction.transactionType === TransactionType.SHARED
    )
    .reduce((total, transaction) => {
      const transactionSum = transaction.participants.reduce(
        (sum, participant) => sum + participant.amount,
        0
      );
      return total + transactionSum;
    }, 0)
);
