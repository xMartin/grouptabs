import React, { memo, ReactFragment, FunctionComponent } from "react";
import { getTransactionType } from "../util/transaction";
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
  var round = function (amount: number) {
    return Math.round(amount * 100) / 100;
  };

  var result: ViewData = {
    title: data.description,
  };

  var transactionType = getTransactionType(data);

  var paymentsList = data.participants
    .filter(function (participant) {
      return transactionType === TransactionType.DIRECT
        ? participant.amount > 0
        : !!participant.amount;
    })
    .sort(function (a, b) {
      if (
        a.amount > b.amount ||
        (a.amount === b.amount &&
          a.participant.toLowerCase() < b.participant.toLowerCase())
      ) {
        return -1;
      }
      return 1;
    });

  var payments = "";
  var total = 0;
  paymentsList.forEach(function (payment, idx) {
    payments += payment.participant + ": " + round(payment.amount);

    if (
      idx < paymentsList.length - 1 ||
      data.participants.length > paymentsList.length
    ) {
      if (transactionType === TransactionType.DIRECT) {
        payments += " → ";
      } else {
        payments += ", ";
      }
    }

    total += payment.amount;
  });
  result.payments = <strong>{payments}</strong>;
  result.total = round(total);

  var participantsList = data.participants
    .map(function (participant) {
      return participant.participant;
    })
    .sort(function (a, b) {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    });

  var participants = "";
  participantsList.forEach(function (participant) {
    for (var i = 0, l = paymentsList.length; i < l; ++i) {
      if (paymentsList[i].participant === participant) {
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
  var data = formatData(transaction);

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
