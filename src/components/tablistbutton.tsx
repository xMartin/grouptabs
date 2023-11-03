import { memo, FunctionComponent } from "react";
import { Tab } from "../types";

interface Props {
  data: Tab;
  onClick: (id: string) => void;
}

const TabListButton: FunctionComponent<Props> = ({ data, onClick }) => {
  return (
    <button className="full-width list-item-with-arrow" onClick={() => onClick(data.id)}>
      {data.info?.name}
    </button>
  );
};

export default memo(TabListButton);
