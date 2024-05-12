import { memo, FunctionComponent } from "react";
import { formatHumanDate } from "../util/date";
import TransactionListItem from "./transactionlistitem";
import { Transaction } from "../types";
import { capitalize } from "lodash";

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

  function formatDate(date: string) {
    return capitalize(formatHumanDate(date));
  }

  // XXX Refactor structuring of date groups with a proper loop
  let date = formatDate(transactions[0].date);
  const dateGroups: DateGroup[] = [];
  let dateGroupTransactions: Transaction[] = [];
  transactions.forEach((transaction) => {
    const currentDate = formatDate(transaction.date);
    if (currentDate !== date) {
      dateGroups.push({
        date: date,
        transactions: dateGroupTransactions,
      });
      dateGroupTransactions = [];
    }
    dateGroupTransactions.push(transaction);
    date = formatDate(transaction.date);
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
      {groupTransactions(transactions).map((dateGroup) => (
        <div key={dateGroup.date} className="dategroup">
          <div className="date">{dateGroup.date}</div>
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
  );
};

export default memo(TransactionList);
