import React, { memo } from 'react';

interface Props {
  message: string;
  onOkClick: () => void;
}

const el = React.createElement;

const LoadError: React.FC<Props> = ({ message, onOkClick }) => {
  const handleButtonClick = () => {
    if (message === 'Error: unable to import tab. Please try again.') {
      window.location.reload();
    } else {
      onOkClick();
    }
  };

  return (
    el('div', {className: 'load-error'},
      el('img', {src: 'images/favicon-touch.png', alt: ''}),
      el('h2', null, 'Grouptabs'),
      el('p', null, message),
      el('button', {className: 'create', onClick: handleButtonClick}, 'OK')
    )
  );
};

export default memo(LoadError);
