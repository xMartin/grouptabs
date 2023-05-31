import React, { memo, FunctionComponent } from "react";
import Amount from "./amount";

interface Props {
  amount: number;
}

const TotalSpending: FunctionComponent<Props> = ({ amount }) => (
  <div className="total-sum">
    Total Spending: <Amount hideZeroFraction>{amount}</Amount>
  </div>
);

export default memo(TotalSpending);
