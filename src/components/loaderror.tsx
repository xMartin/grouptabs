import React, { memo, FunctionComponent } from "react";
import logo from "../images/grouptabs-logo.svg";

interface Props {
  message: string;
  onOkClick?: () => void;
}

const LoadError: FunctionComponent<Props> = ({ message, onOkClick }) => {
  const handleButtonClick = () => {
    if (onOkClick) {
      onOkClick();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="load-error">
      <img src={logo} alt="" />
      <h2>Grouptabs</h2>
      <p>{message}</p>
      <button className="create" onClick={handleButtonClick}>
        Refresh
      </button>
    </div>
  );
};

export default memo(LoadError);
