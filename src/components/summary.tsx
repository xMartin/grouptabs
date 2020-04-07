import React, { memo } from "react";
import { Account } from "../types";

interface Props {
  accounts: Account[];
}

function formatData(accounts: Account[]) {
  var round = function (amount: number) {
    return Math.round(amount * 100) / 100;
  };

  var getMaxAmount = function (accounts: Account[]) {
    var result = 0;
    accounts.forEach(function (account) {
      var amount = Math.abs(account.amount);
      if (amount > result) {
        result = amount;
      }
    });
    return round(result);
  };

  var getCssColor = function (amount: number, maxAmount: number) {
    if (!maxAmount) {
      return "transparent";
    }
    var color = amount < 0 ? [226, 91, 29] : [92, 226, 14];
    var opacity = Math.abs(amount) / maxAmount;
    color.push(opacity);
    return "rgba(" + color.join(",") + ")";
  };

  var maxAmount = getMaxAmount(accounts);
  var data = accounts.map(function (account) {
    return {
      amount: round(account.amount),
      cssColor: getCssColor(account.amount, maxAmount),
      participant: account.participant,
    };
  });

  return data;
}

const Summary: React.FC<Props> = ({ accounts }) => (
  <div id="summary">
    <table id="balance">
      <tbody>
        {formatData(accounts).map((account) => (
          <tr
            key={account.participant}
            style={{ backgroundColor: account.cssColor }}
          >
            <th className="account">{account.participant}</th>
            <td className="amount">{account.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default memo(Summary);
