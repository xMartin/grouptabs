import React, { SyntheticEvent, FunctionComponent, memo } from "react";
import { control } from "../util/form";

interface Props {
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  tabId?: string;
  onTabIdChange: (tabId: string) => void;
  onSubmit: (tabId: string) => void;
}

const ImportForm: FunctionComponent<Props> = ({
  checkingRemoteTab,
  remoteTabError,
  tabId,
  onTabIdChange,
  onSubmit,
}) => {
  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (tabId) {
      onSubmit(tabId);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="import-form">
      <input
        type="text"
        className="full-width"
        placeholder="Open shared tab"
        disabled={checkingRemoteTab}
        value={control(tabId)}
        onChange={(event: SyntheticEvent<HTMLInputElement>) =>
          onTabIdChange(event.currentTarget.value)
        }
        onFocus={(e) => (e.target.placeholder = "Tab ID …")}
        onBlur={(e) => (e.target.placeholder = "Open shared tab")}
      />
      <button disabled={checkingRemoteTab}>
        {checkingRemoteTab ? "Checking …" : "Open shared tab"}
      </button>
      <div className="error-message">{remoteTabError}</div>
    </form>
  );
};

export default memo(ImportForm);
