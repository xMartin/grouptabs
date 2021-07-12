import React, { memo, FunctionComponent } from "react";
import { Account } from "../types";

interface Props {
  accounts: Account[];
}

function formatData(accounts: Account[]) {
  const round = (amount: number) => Math.round(amount);

  const getMaxAmount = (accounts: Account[]) => {
    let result = 0;
    accounts.forEach((account) => {
      const amount = Math.abs(account.amount);
      if (amount > result) {
        result = amount;
      }
    });
    return round(result);
  };

  const getRowStyle = (amount: number, maxAmount: number) => {
    if (!maxAmount) {
      return { backgroundColor: "transparent" };
    }
    const color = amount < 0 ? [255, 68, 68] : [255, 255, 255];
    const opacity = amount < 0 ? Math.abs(amount) / maxAmount : 0;
    color.push(opacity);
    const textColor =
      opacity > 0.6 && amount < 0 ? "var(--color-primary-opposite)" : "";
    return { backgroundColor: `rgba(${color.join(",")})`, color: textColor };
  };

  const maxAmount = getMaxAmount(accounts);
  const data = accounts.map((account) => ({
    amount: round(account.amount),
    style: getRowStyle(account.amount, maxAmount),
    participant: account.participant,
  }));

  return data;
}

const Summary: FunctionComponent<Props> = ({ accounts }) => (
  <ol className="summary">
    {formatData(accounts).map((account) => (
      <li key={account.participant} style={account.style}>
        <div className="amount">{account.amount}</div>
        <div className="account" style={account.style}>
          {account.participant}
        </div>
      </li>
    ))}
  </ol>
);

export default memo(Summary);
