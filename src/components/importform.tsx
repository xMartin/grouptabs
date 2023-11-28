import { SyntheticEvent, FunctionComponent, memo } from "react";
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
      <div className="row-label">Import group:</div>
      <input
        type="text"
        className="full-width"
        placeholder="Group ID …"
        disabled={checkingRemoteTab}
        autoFocus={true}
        value={control(tabId)}
        onChange={(event: SyntheticEvent<HTMLInputElement>) =>
          onTabIdChange(event.currentTarget.value)
        }
      />
      <button disabled={checkingRemoteTab}>
        {checkingRemoteTab ? "Checking…" : "Import"}
      </button>
      <div className="error-message">{remoteTabError}</div>
    </form>
  );
};

export default memo(ImportForm);
