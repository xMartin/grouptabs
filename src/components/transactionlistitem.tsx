import { FunctionComponent, memo } from "react";
import { Transaction, TransactionType } from "../types";
import Amount from "./amount";

interface Props {
  transaction: Transaction;
  onDetailsClick: (tabId: string, transactionId: string) => void;
}

const formatData = (data: Transaction) => {
  const round = (amount: number) => Math.round(amount * 100) / 100;

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
  total = round(total);

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
  participants = participants.substring(0, participants.length - 2);

  return {
    title: data.description,
    payments,
    participants,
    total,
  };
};

const TransactionListItem: FunctionComponent<Props> = ({
  transaction,
  onDetailsClick,
}) => {
  const data = formatData(transaction);

  return (
    <div
      className="transaction list-item-with-arrow"
      onClick={() => onDetailsClick(transaction.tabId, transaction.id)}
    >
      <table>
        <tbody>
          <tr>
            <td className="title">
              {data.title}
              <div className="payments">
                <strong>{data.payments}</strong>
                {data.participants}
              </div>
            </td>
            <td className="total">
              <Amount hideZeroFraction>{data.total}</Amount>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default memo(TransactionListItem);
