import { memo, FunctionComponent } from "react";
import Brand from "./brand";

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
      <Brand />
      <p>{message}</p>
      <button className="create" onClick={handleButtonClick}>
        OK
      </button>
    </div>
  );
};

export default memo(LoadError);
