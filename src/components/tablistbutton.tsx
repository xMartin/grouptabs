import React, { memo } from 'react';
import { Tab } from "../types";

interface Props {
  data: Tab;
  onClick: (id: string) => void;
}

const TabListButton: React.FC<Props> = ({ data, onClick }) => {
  return (
    <button className="full-width" onClick={() => onClick(data.id)}>
      {data.name}
    </button>
  );
};

export default memo(TabListButton);
