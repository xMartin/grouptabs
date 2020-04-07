import React, { memo } from "react";

interface Props {
  amount: number;
}

const TotalSpending: React.FC<Props> = ({ amount }) => {
  const formattedAmount = Math.round(amount * 100) / 100;

  return <div className="total-sum">Total Spending: {formattedAmount}</div>;
};

export default memo(TotalSpending);
