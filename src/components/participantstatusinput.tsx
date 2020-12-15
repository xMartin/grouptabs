import React, { SyntheticEvent, FunctionComponent, memo } from "react";
import { TransactionFormParticipantStatus as Status } from "../types";
import { control } from "../util/form";

interface Props {
  status: Status;
  amount?: number;
  onJoinedChange: () => void;
  onPaidChange: () => void;
  onAmountChange: (amount?: number) => void;
}

const ParticipationStatusInput: FunctionComponent<Props> = ({
  status,
  amount,
  onJoinedChange,
  onPaidChange,
  onAmountChange,
}) => {
  return (
    <span className="participationStatus">
      {status !== Status.PAID && (
        <span className="joinedButtonWrapper">
          <button
            type="button"
            className={status > Status.NONE ? "selected" : ""}
            onClick={onJoinedChange}
          >
            joined
          </button>
        </span>
      )}
      <button
        type="button"
        className={"paid-button" + (status === Status.PAID ? " selected" : "")}
        onClick={onPaidChange}
      >
        paid
      </button>
      {status === Status.PAID && (
        <span className="amountInput">
          <input
            type="number"
            step="any"
            placeholder="0"
            value={control(amount)}
            onChange={(event: SyntheticEvent<HTMLInputElement>) =>
              onAmountChange(
                event.currentTarget.value
                  ? parseFloat(event.currentTarget.value)
                  : undefined
              )
            }
            autoFocus={true}
          />
        </span>
      )}
    </span>
  );
};

export default memo(ParticipationStatusInput);
