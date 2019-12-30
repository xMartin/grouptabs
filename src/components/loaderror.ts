import React, { memo } from 'react';
import logo from '../images/logo.png';

interface Props {
  message: string;
  onOkClick?: () => void;
}

const el = React.createElement;

const LoadError: React.FC<Props> = ({ message, onOkClick }) => {
  const handleButtonClick = () => {
    if (onOkClick) {
      onOkClick();
    } else {
      window.location.reload();
    }
  };

  return (
    el('div', {className: 'load-error'},
      el('img', {src: logo, alt: ''}),
      el('h2', null, 'Grouptabs'),
      el('p', null, message),
      el('button', {className: 'create', onClick: handleButtonClick}, 'OK')
    )
  );
};

export default memo(LoadError);
