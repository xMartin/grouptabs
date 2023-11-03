import { memo, FunctionComponent } from "react";
import Brand from "./brand";

interface Props {
  error: { error: any; info: any };
}

const Error: FunctionComponent<Props> = () => {
  return (
    <div className="scene errorScene">
      <div className="header header-brand">
        <Brand />
      </div>
      <p>Oops, unfortunately an error occured.</p>
      <p>
        <a href="#" onClick={() => window.location.reload()}>
          Try reloading
        </a>
      </p>
    </div>
  );
};

export default memo(Error);
