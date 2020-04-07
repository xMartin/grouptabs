import React, { memo } from "react";
import dateUtils from "../util/date";
import TransactionListItem from "./transactionlistitem";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  onDetailsClick: (tabId: string, transactionId: string) => void;
}

interface DateGroup {
  date: string;
  transactions: Transaction[];
}

const groupTransactions = (transactions: Transaction[]) => {
  if (!transactions.length) {
    return (transactions as unknown) as DateGroup[];
  }
  // XXX Refactor structuring of date groups with a proper loop
  var date = dateUtils.formatHumanDate(transactions[0].date);
  var dateGroups: DateGroup[] = [];
  var dateGroupTransactions: Transaction[] = [];
  transactions.forEach(function (transaction) {
    var currentDate = dateUtils.formatHumanDate(transaction.date);
    if (currentDate !== date) {
      dateGroups.push({
        date: date,
        transactions: dateGroupTransactions,
      });
      dateGroupTransactions = [];
    }
    dateGroupTransactions.push(transaction);
    date = dateUtils.formatHumanDate(transaction.date);
  });
  dateGroups.push({
    date: date,
    transactions: dateGroupTransactions,
  });
  return dateGroups;
};

const TransactionList: React.FC<Props> = ({ transactions, onDetailsClick }) => {
  return (
    <div id="transactions">
      <div>
        {groupTransactions(transactions).map((dateGroup) => (
          <div key={dateGroup.date}>
            <div className="dategroup">{dateGroup.date}</div>
            {dateGroup.transactions.map((transaction) => {
              return (
                <TransactionListItem
                  key={transaction.timestamp + "_" + transaction.description}
                  transaction={transaction}
                  onDetailsClick={onDetailsClick}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TransactionList);
