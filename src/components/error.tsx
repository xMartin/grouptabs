import React, { memo } from 'react';
import logo from '../images/logo.png';

interface Props {
  error: { error: any, info: any };
}

const Error: React.FC<Props> = () => {
  return (
    <div className="scene errorScene">
      <div className="header">
        <img id="logo" src={logo} alt="" />
        <h2>Error</h2>
      </div>
      <p>Oops, unfortunately an error occured.</p>
      <p>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a href="#" onClick={() => window.location.reload()}>
          Try reloading
        </a>
      </p>
    </div>
  );
};

export default memo(Error);
