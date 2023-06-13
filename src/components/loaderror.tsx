import React, { memo, FunctionComponent } from "react";
import logo from "../images/logo.png";

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
      <h2>uneven</h2>
      <p>{message}</p>
      <button className="create" onClick={handleButtonClick}>
        OK
      </button>
    </div>
  );
};

export default memo(LoadError);
