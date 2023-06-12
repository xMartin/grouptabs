import React, { memo, FunctionComponent } from "react";
import { Account } from "../types";
import Amount from "./amount";

interface Props {
  accounts: Account[];
}

function formatData(accounts: Account[]) {
  const round = (amount: number) => Math.round(amount * 100) / 100;

  const getMaxAmount = (accounts: Account[]) => {
    let result = 0;
    accounts.forEach((account) => {
      const amount = Math.abs(account.amount);
      if (amount > result) {
        result = amount;
      }
    });
    return result;
  };

  const maxAmount = getMaxAmount(accounts);
  const data = accounts.map((account) => ({
    amount: round(account.amount),
    percentage: maxAmount ? (Math.abs(account.amount) / maxAmount) * 100 : 0,
    participant: account.participant,
  }));

  return data;
}

const cellPadding = 12;

const Summary: FunctionComponent<Props> = ({ accounts }) => (
  <table className="summary">
    <tbody>
      {formatData(accounts).map((account) => (
        <tr key={account.participant}>
          <th className="account">
            {account.participant}
            <div
              className={`summary-bar ${
                account.amount < 0 ? "negative" : "positive"
              }`}
              style={{
                width: `calc(${account.percentage}% - ${cellPadding * 2}px)`,
              }}
            />
          </th>
          <td className="amount">
            <Amount>{account.amount}</Amount>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default memo(Summary);
