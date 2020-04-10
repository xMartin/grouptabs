import React, { memo, FunctionComponent } from "react";

interface Props {
  amount: number;
}

const TotalSpending: FunctionComponent<Props> = ({ amount }) => {
  const formattedAmount = Math.round(amount * 100) / 100;

  return <div className="total-sum">Total Spending: {formattedAmount}</div>;
};

export default memo(TotalSpending);
