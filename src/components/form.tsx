import React, {
  SyntheticEvent,
  FunctionComponent,
  memo,
  useRef,
  useEffect,
} from "react";
import DateInput from "./dateinput";
import DirectTransactionInput from "./directtransactioninput";
import ParticipantsInputList from "./participantsinputlist";
import {
  TransactionType,
  TransactionFormState,
  TransactionFormParticipantStatus as Status,
} from "../types";
import { control } from "../util/form";
import { PropsFromRedux } from "../app";
import { validate } from "../util/transactionform";

interface Props {
  visible?: boolean;
  mode: "new" | "edit";
  data: TransactionFormState;
  onUpdateForm: PropsFromRedux["onUpdateTransactionForm"];
  onUpdateSharedForm: PropsFromRedux["onUpdateTransactionSharedForm"];
  onUpdateDirectForm: PropsFromRedux["onUpdateTransactionDirectForm"];
  onUpdateParticipant: PropsFromRedux["onUpdateTransactionParticipant"];
  onAddParticipant: () => void;
  onSetAllJoined: () => void;
  onSave: () => void;
  onDelete: () => void;
}

const Form: FunctionComponent<Props> = (props) => {
  const descriptionInput = useRef<HTMLInputElement>(null);

  // focus desciption when view is visible
  useEffect(() => {
    if (props.mode === "new" && props.visible) {
      descriptionInput.current?.focus();
    }
  }, [props.mode, props.visible]);

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate(props.data)) {
      alert(
        "Please fill in all fields and have at least two participants and one person who paid."
      );
      return;
    }

    props.onSave();
  };

  const handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you really want to delete the transaction?")) {
      props.onDelete();
    }
  };

  const handleSelectTransactionType = (
    event: SyntheticEvent<HTMLSelectElement>
  ) => {
    const transactionType = event.currentTarget.value;
    props.onUpdateForm(
      "transactionType",
      TransactionType[transactionType as keyof typeof TransactionType]
    );
  };

  const handleDateChange = (date: string) => {
    props.onUpdateForm("date", date);
  };

  const numberOfNonJoined = props.data.shared.filter(
    (participant) => participant.status === Status.NONE
  ).length;
  const showAllJoinedButton = numberOfNonJoined > 1;

  return (
    <form id="edit-entry-form" className="content" onSubmit={handleSubmit}>
      <div className="form">
        <div className="form-row">
          <div className="form-row-input description">
            <input
              ref={descriptionInput}
              type="text"
              placeholder="Description"
              value={control(props.data.description)}
              onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                props.onUpdateForm("description", event.currentTarget.value)
              }
            />
          </div>
          <div className="form-row-input transaction-type">
            <select
              onChange={handleSelectTransactionType}
              value={props.data.transactionType}
            >
              <option value={TransactionType.SHARED}>Shared</option>
              <option value={TransactionType.DIRECT}>Direct</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-row-input">
            <DateInput date={props.data.date} onChange={handleDateChange} />
          </div>
        </div>
        <div
          style={{
            display:
              props.data.transactionType === TransactionType.SHARED
                ? "none"
                : "",
          }}
          className="form-row"
        >
          <DirectTransactionInput
            data={props.data.direct}
            onChange={props.onUpdateDirectForm}
          />
        </div>
        <div
          style={{
            display:
              props.data.transactionType === TransactionType.DIRECT
                ? "none"
                : "",
          }}
        >
          <ParticipantsInputList
            inputs={props.data.shared}
            onChangeParticipant={props.onUpdateParticipant}
          />
          <div className="form-row">
            <div className="form-row-input">
              <button type="button" onClick={props.onAddParticipant}>
                + new participant
              </button>
              {showAllJoinedButton && (
                <button
                  type="button"
                  className="all-joined"
                  onClick={props.onSetAllJoined}
                >
                  all joined
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={"row" + (props.mode === "edit" ? " button-row" : "")}>
        {props.mode === "edit" ? (
          <span className="fake-link delete" onClick={handleDelete}>
            Delete transaction
          </span>
        ) : null}
      </div>
    </form>
  );
};

export default memo(Form);
