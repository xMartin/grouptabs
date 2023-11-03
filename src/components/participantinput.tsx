import { FunctionComponent, memo } from "react";
import ParticipantStatusInput from "./participantstatusinput";
import { TransactionFormParticipantStatus as Status } from "../types";
import { PropsFromRedux } from "../app";

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: PropsFromRedux["onUpdateTransactionParticipant"];
}

const ParticipantInput: FunctionComponent<Props> = ({
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
        "participantInput" +
        (status > Status.NONE ? " selected" : "") +
        (status === Status.PAID ? " paid" : "")
      }
    >
      <span className="participant">{participant}</span>
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

export default memo(ParticipantInput);
