import React, { SyntheticEvent, FunctionComponent, memo } from "react";
import ParticipantStatusInput from "./participantstatusinput";
import { TransactionFormParticipantStatus as Status } from "../types";
import { control } from "../util/form";
import { PropsFromRedux } from "../app";

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: PropsFromRedux["onUpdateTransactionParticipant"];
}

const NewParticipantInput: FunctionComponent<Props> = ({
  id,
  participant,
  status,
  amount,
  onChange,
}) => {
  const handleJoinedChange = () => {
    const newStatus = status === Status.NONE ? Status.JOINED : Status.NONE;
    onChange(id, "status", newStatus);
  };

  const handlePaidChange = () => {
    const newStatus = status < Status.PAID ? Status.PAID : Status.JOINED;
    onChange(id, "status", newStatus);
  };

  return (
    <div
      className={
        "newParticipantInput" +
        (status > Status.NONE ? " selected" : "") +
        (status === Status.PAID ? " paid" : "")
      }
    >
      <span className="participant">
        <input
          type="text"
          placeholder="Name …"
          value={control(participant)}
          onChange={(event: SyntheticEvent<HTMLInputElement>) =>
            onChange(id, "participant", event.currentTarget.value)
          }
          autoFocus={true}
        />
      </span>
      <ParticipantStatusInput
        status={status}
        amount={amount}
        onJoinedChange={handleJoinedChange}
        onPaidChange={handlePaidChange}
        onAmountChange={(amount?: number) => onChange(id, "amount", amount)}
      />
    </div>
  );
};

export default memo(NewParticipantInput);
