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
    payments += payment.participant + ": " + round(payment.amount);

    if (
      idx < paymentsList.length - 1 ||
      data.participants.length > paymentsList.length
    ) {
      if (data.transactionType === TransactionType.DIRECT) {
        payments += " → ";
      } else {
        payments += ", ";
      }
    }

    total += payment.amount;
  });
  result.payments = <strong>{payments}</strong>;
  result.total = round(total);

  const participantsList = data.participants
    .map((participant) => participant.participant)
    .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1));

  let participants = "";
  participantsList.forEach((participant) => {
    for (const payment of paymentsList) {
      if (payment.participant === participant) {
        return;
      }
    }

    participants += participant + ", ";
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
    <div
      className="transaction"
      onClick={() => onDetailsClick(transaction.tabId, transaction.id)}
    >
      <table>
        <tbody>
          <tr>
            <td className="title">
              {data.title}
              <div className="payments">
                {data.payments}
                {data.participants}
              </div>
            </td>
            <td className="total">{data.total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default memo(TransactionListItem);
