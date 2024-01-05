import {
  SyntheticEvent,
  FunctionComponent,
  memo,
  useRef,
  useEffect,
} from "react";
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
  const readyForAutoFocus = useRef<boolean>(false);
  // set ready for auto focus on mount so inputs will only focus when they appear later
  useEffect(() => {
    readyForAutoFocus.current = true;
  }, []);

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
                  : undefined,
              )
            }
            autoFocus={readyForAutoFocus.current}
          />
        </span>
      )}
    </span>
  );
};

export default memo(ParticipationStatusInput);
