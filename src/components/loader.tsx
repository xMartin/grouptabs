import React, { memo } from 'react';

interface Props {
  show?: boolean;
  children: React.ReactNode;  // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33602
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
