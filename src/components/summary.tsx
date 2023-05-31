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
    return round(result);
  };

  const getRowStyle = (amount: number, maxAmount: number) => {
    if (!maxAmount) {
      return { backgroundColor: "transparent" };
    }
    const color = amount < 0 ? [226, 91, 29] : [92, 226, 14];
    const opacity = Math.abs(amount) / maxAmount;
    color.push(opacity);
    const textColor = opacity > 0.6 ? "var(--dark-color)" : "";
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
  <table className="summary">
    <tbody>
      {formatData(accounts).map((account) => (
        <tr key={account.participant} style={account.style}>
          <th className="account">{account.participant}</th>
          <td className="amount">
            <Amount>{account.amount}</Amount>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default memo(Summary);
