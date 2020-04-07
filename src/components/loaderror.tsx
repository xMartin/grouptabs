import React, { memo } from 'react';
import logo from '../images/logo.png';

interface Props {
  message: string;
  onOkClick?: () => void;
}

const LoadError: React.FC<Props> = ({ message, onOkClick }) => {
  const handleButtonClick = () => {
    if (onOkClick) {
      onOkClick();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className='load-error'>
      <img src={logo} alt='' />
      <h2>Grouptabs</h2>
      <p>{message}</p>
      <button className='create' onClick={handleButtonClick}>OK</button>
    </div>
  );
};

export default memo(LoadError);
