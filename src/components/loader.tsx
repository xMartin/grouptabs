import React, { memo } from 'react';

interface Props {
  show?: boolean;
}

const Loader: React.FC<Props> = ({ show, children }) => {
  if (show) {
    return (
      <div className="loader tab-loader">
        <div />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default memo(Loader);
