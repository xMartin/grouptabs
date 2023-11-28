import { memo, FunctionComponent } from "react";

interface Props {
  show?: boolean;
  children: React.ReactNode; // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/33602
}

const Loader: FunctionComponent<Props> = ({ show, children }) => {
  if (show) {
    return <div className="loader tab-loader" />;
  }

  return <>{children}</>;
};

export default memo(Loader);
