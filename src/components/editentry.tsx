import React, { ReactFragment, FunctionComponent, memo } from "react";
import Loader from "./loader";
import Form from "./form";
import LoadError from "./loaderror";
import { TransactionFormState } from "../types";
import { PropsFromRedux } from "../app";

interface Props {
  visible?: boolean;
  mode: "new" | "edit";
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  formState?: TransactionFormState;
  onUpdateForm: PropsFromRedux["onUpdateTransactionForm"];
  onUpdateSharedForm: PropsFromRedux["onUpdateTransactionSharedForm"];
  onUpdateDirectForm: PropsFromRedux["onUpdateTransactionDirectForm"];
  onUpdateParticipant: PropsFromRedux["onUpdateTransactionParticipant"];
  onAddParticipant: () => void;
  onSetAllJoined: () => void;
  onCloseClick: () => void;
  onChangeTabClick: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const EditEntry: FunctionComponent<Props> = (props) => {
  const renderHeader = (showSaveButton: boolean): ReactFragment => (
    <div className="header">
      <button className="left" onClick={props.onCloseClick}>
        <svg height="16" width="16">
          <path d="m7.4983 0.5c0.8974 0 1.3404 1.0909 0.6973 1.7168l-4.7837 4.7832h11.573c1.3523-0.019125 1.3523 2.0191 0 2h-11.572l4.7832 4.7832c0.98163 0.94251-0.47155 2.3957-1.4141 1.4141l-6.4911-6.49c-0.387-0.3878-0.391-1.0228 0-1.414l6.4905-6.49c0.1883-0.1935 0.4468-0.30268 0.7168-0.3027z" />
        </svg>
      </button>
      <h2>{props.mode === "new" ? "New transaction" : "Edit transaction"}</h2>
      {showSaveButton && (
        <button className="right create" form="edit-entry-form">
          <svg height="16" width="16">
            <path
              d="m13.631 3.9906a1.0001 1.0001 0 0 0-0.6875 0.30273l-6.5937 6.5938-3.293-3.293a1.0001 1.0001 0 1 0-1.4141 1.4141l4 4a1.0001 1.0001 0 0 0 1.4141 0l7.3008-7.3008a1.0001 1.0001 0 0 0-0.72656-1.7168z"
              fill="#fff"
            />
          </svg>
        </button>
      )}
    </div>
  );

  const renderContent = () => {
    if (props.remoteTabError) {
      return (
        <LoadError
          message={props.remoteTabError}
          onOkClick={props.onChangeTabClick}
        />
      );
    }

    if (props.mode === "edit" && !props.formState) {
      const message = "Could not find transaction.";
      return <LoadError message={message} onOkClick={props.onCloseClick} />;
    }

    if (!props.formState) {
      return null;
    }

    return (
      <Form
        visible={props.visible}
        mode={props.mode}
        data={props.formState}
        onUpdateForm={props.onUpdateForm}
        onUpdateSharedForm={props.onUpdateSharedForm}
        onUpdateDirectForm={props.onUpdateDirectForm}
        onUpdateParticipant={props.onUpdateParticipant}
        onAddParticipant={props.onAddParticipant}
        onSetAllJoined={props.onSetAllJoined}
        onSave={props.onSave}
        onDelete={props.onDelete}
      />
    );
  };

  const isLoading = props.checkingRemoteTab || props.importingTab;

  return (
    <>
      {renderHeader(
        !isLoading &&
          !(props.remoteTabError || (props.mode === "edit" && !props.formState))
      )}
      <Loader show={isLoading}>{renderContent()}</Loader>
    </>
  );
};

export default memo(EditEntry);
