import React, { PureComponent, SyntheticEvent } from "react";
import DateInput from "./dateinput";
import DirectTransactionInput from "./directtransactioninput";
import ParticipantsInputList from "./participantsinputlist";
import { TransactionType, TransactionFormState } from "../types";
import { control } from "../util/form";
import { PropsFromRedux } from "../app";
import { validate } from "../util/transactionform";

interface Props {
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

export default class Form extends PureComponent<Props> {
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate(this.props.data)) {
      alert(
        "Please fill in all fields and have at least two participants and one person who paid."
      );
      return;
    }

    this.props.onSave();
  };

  handleDelete = () => {
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Do you really want to delete the transaction?")) {
      this.props.onDelete();
    }
  };

  handleSelectTransactionType = (event: SyntheticEvent<HTMLSelectElement>) => {
    var transactionType = event.currentTarget.value;
    this.props.onUpdateForm(
      "transactionType",
      TransactionType[transactionType as keyof typeof TransactionType]
    );
  };

  handleDateChange = (date: string) => {
    this.props.onUpdateForm("date", date);
  };

  render() {
    const { mode, data, onUpdateForm, onUpdateDirectForm } = this.props;

    return (
      <form id="edit-entry-form" onSubmit={this.handleSubmit}>
        <div className="form">
          <div className="form-row">
            <div className="form-row-input description">
              <input
                type="text"
                placeholder="Description"
                value={control(data.description)}
                onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                  onUpdateForm("description", event.currentTarget.value)
                }
                autoFocus={mode === "new" ? true : undefined}
              />
            </div>
            <div className="form-row-input transaction-type">
              <select
                onChange={this.handleSelectTransactionType}
                value={data.transactionType}
              >
                <option value={TransactionType.SHARED}>Shared</option>
                <option value={TransactionType.DIRECT}>Direct</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-row-input">
              <DateInput date={data.date} onChange={this.handleDateChange} />
            </div>
          </div>
          <div
            style={{
              display:
                data.transactionType === TransactionType.SHARED ? "none" : "",
            }}
            className="form-row"
          >
            <DirectTransactionInput
              data={data.direct}
              onChange={onUpdateDirectForm}
            />
          </div>
          <div
            style={{
              display:
                data.transactionType === TransactionType.DIRECT ? "none" : "",
            }}
          >
            <ParticipantsInputList
              inputs={data.shared}
              onChangeParticipant={this.props.onUpdateParticipant}
            />
            <div className="form-row">
              <div className="form-row-input">
                <button type="button" onClick={this.props.onAddParticipant}>
                  + new participant
                </button>
                <button
                  type="button"
                  className="all-joined"
                  onClick={this.props.onSetAllJoined}
                >
                  all joined
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={"row" + (mode === "edit" ? " button-row" : "")}>
          {mode === "edit" ? (
            <span className="fake-link delete" onClick={this.handleDelete}>
              Delete transaction
            </span>
          ) : null}
        </div>
      </form>
    );
  }
}
