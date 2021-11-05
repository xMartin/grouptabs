import React, { memo, FunctionComponent } from "react";
import { formatHumanDate } from "../util/date";
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

const groupTransactions = (transactions: Transaction[]): DateGroup[] => {
  if (!transactions.length) {
    return transactions as unknown as DateGroup[];
  }
  // XXX Refactor structuring of date groups with a proper loop
  let date = formatHumanDate(transactions[0].date);
  const dateGroups: DateGroup[] = [];
  let dateGroupTransactions: Transaction[] = [];
  transactions.forEach((transaction) => {
    const currentDate = formatHumanDate(transaction.date);
    if (currentDate !== date) {
      dateGroups.push({
        date: date,
        transactions: dateGroupTransactions,
      });
      dateGroupTransactions = [];
    }
    dateGroupTransactions.push(transaction);
    date = formatHumanDate(transaction.date);
  });
  dateGroups.push({
    date: date,
    transactions: dateGroupTransactions,
  });
  return dateGroups;
};

const TransactionList: FunctionComponent<Props> = ({
  transactions,
  onDetailsClick,
}) => {
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
