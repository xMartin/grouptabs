import React, { memo, FunctionComponent } from "react";
import { Tab } from "../types";

interface Props {
  data: Tab;
  onClick: (id: string) => void;
}

const TabListButton: FunctionComponent<Props> = ({ data, onClick }) => {
  console.log("test");
  return (
    <button className="full-width" onClick={() => onClick(data.id)}>
      <strong>{data.info?.name}</strong>
      <span>
        {data.mostRecentTransaction
          ? "Most recent: " + data.mostRecentTransaction?.description
          : "No transactions yet"}
      </span>
    </button>
  );
};

export default memo(TabListButton);
