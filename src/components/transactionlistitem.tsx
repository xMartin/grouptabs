import React, { FunctionComponent, memo, ReactFragment } from "react";
import { Transaction, TransactionType } from "../types";

interface Props {
  transaction: Transaction;
  onDetailsClick: (tabId: string, transactionId: string) => void;
}

interface ViewData {
  title: string;
  payments?: ReactFragment;
  participants?: string;
  total?: number;
}

const formatData = (data: Transaction) => {
  const round = (amount: number) => Math.round(amount * 100) / 100;

  const result: ViewData = {
    title: data.description,
  };

  const paymentsList = data.participants
    .filter((participant) => {
      return data.transactionType === TransactionType.DIRECT
        ? participant.amount > 0
        : !!participant.amount;
    })
    .sort((a, b) => {
      if (
        a.amount > b.amount ||
        (a.amount === b.amount &&
          a.participant.toLowerCase() < b.participant.toLowerCase())
      ) {
        return -1;
      }
      return 1;
    });

  let payments = "";
  let total = 0;
  paymentsList.forEach((payment, idx) => {
    payments += payment.participant + " " + round(payment.amount);

    if (
      idx < paymentsList.length - 1 ||
      data.participants.length > paymentsList.length
    ) {
      if (data.transactionType === TransactionType.DIRECT) {
        payments += " → ";
      } else {
        payments += " · ";
      }
    }

    total += payment.amount;
  });
  result.payments = <em>{payments}</em>;
  result.total = round(total);

  const participantsList = data.participants
    .map((participant) => participant.participant)
    .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));

  let participants = "";
  participantsList.forEach((participant) => {
    for (let i = 0, l = paymentsList.length; i < l; ++i) {
      if (paymentsList[i].participant === participant) {
        return;
      }
    }

    participants += participant + " · ";
  });
  result.participants = participants.substring(0, participants.length - 2);

  return result;
};

const TransactionListItem: FunctionComponent<Props> = ({
  transaction,
  onDetailsClick,
}) => {
  const data = formatData(transaction);

  return (
    <button
      className="transaction"
      onClick={() => onDetailsClick(transaction.tabId, transaction.id)}
    >
      <div className="transaction-text">
        <div className="title">{data.title}</div>
        <div className="payments">
          {data.payments}
          {data.participants}
        </div>
      </div>
      <div className="total">{data.total}</div>
    </button>
  );
};

export default memo(TransactionListItem);
