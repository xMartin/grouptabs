import React, { SyntheticEvent, FunctionComponent, useRef, memo } from "react";
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
  const amountInput = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (status === Status.PAID) {
  //     amountInput.current?.focus();
  //   }
  // }, [status]);

  return (
    <span className="participationStatus">
      <span
        className={
          "joinedButtonWrapper" + (status === Status.PAID ? " hidden" : "")
        }
      >
        <button
          type="button"
          className={status > Status.NONE ? " selected" : ""}
          onClick={onJoinedChange}
        >
          joined
        </button>
      </span>
      <button
        type="button"
        className={"paid-button" + (status === Status.PAID ? " selected" : "")}
        onClick={onPaidChange}
      >
        paid
      </button>
      <span className={"amountInput" + (status < Status.PAID ? " hidden" : "")}>
        <input
          ref={amountInput}
          type="number"
          step="any"
          disabled={status !== Status.PAID}
          placeholder="0"
          value={control(amount)}
          onChange={(event: SyntheticEvent<HTMLInputElement>) =>
            onAmountChange(
              event.currentTarget.value
                ? parseFloat(event.currentTarget.value)
                : undefined
            )
          }
        />
      </span>
    </span>
  );
};

export default memo(ParticipationStatusInput);
