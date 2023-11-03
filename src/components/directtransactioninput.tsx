import { SyntheticEvent, FunctionComponent, memo } from "react";
import { TransactionFormState } from "../types";
import { NEW_PARTICIPANT_OPTION } from "../util/transactionform";
import { control } from "../util/form";
import { PropsFromRedux } from "../app";

const newParticipantOptionLabel = "New participant…";

interface Props {
  data: TransactionFormState["direct"];
  onChange: PropsFromRedux["onUpdateTransactionDirectForm"];
}

const DirectTransactionInput: FunctionComponent<Props> = ({
  data,
  onChange,
}) => {
  const { to, toNew, from, fromNew, amount, options } = data;

  const handleChangeFrom = (event: SyntheticEvent<HTMLSelectElement>) => {
    const from = event.currentTarget.value;
    onChange("from", from);
  };

  const handleChangeTo = (event: SyntheticEvent<HTMLSelectElement>) => {
    const to = event.currentTarget.value;
    onChange("to", to);
  };

  const renderOptions = () => {
    return data.options.map((participant) => {
      let label = participant;
      let value = participant;
      if (participant === NEW_PARTICIPANT_OPTION) {
        label = newParticipantOptionLabel;
        value = NEW_PARTICIPANT_OPTION;
      }
      return (
        <option key={participant} value={value}>
          {label}
        </option>
      );
    });
  };

  return (
    <div className="direct-transaction">
      <div
        className="form-row"
        style={options.length > 1 ? undefined : { display: "none" }}
      >
        <div className="form-row-input">
          <select
            className="full-width"
            value={control(from)}
            onChange={handleChangeFrom}
          >
            {renderOptions()}
          </select>
        </div>
      </div>
      {from === NEW_PARTICIPANT_OPTION && (
        <div className="form-row">
          <div className="form-row-input">
            <input
              type="text"
              placeholder="Name …"
              value={control(fromNew)}
              onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                onChange("fromNew", event.currentTarget.value)
              }
              autoFocus={true}
            />
          </div>
        </div>
      )}
      <div className="direct-transaction-amount">
        <svg height="16" width="16">
          <path d="m15.511 8.5129c0-0.8974-1.0909-1.3404-1.7168-0.6973l-4.7832 4.7837v-11.573c0.019125-1.3523-2.0191-1.3523-2 0v11.572l-4.7832-4.7832c-0.94251-0.98163-2.3957 0.47155-1.4141 1.4141l6.49 6.4911c0.3878 0.387 1.0228 0.391 1.414 0l6.4903-6.4906c0.1935-0.1883 0.30268-0.4468 0.3027-0.7168z" />
        </svg>
        <input
          type="number"
          step="any"
          placeholder="0"
          value={control(amount)}
          onChange={(event: SyntheticEvent<HTMLInputElement>) =>
            onChange(
              "amount",
              event.currentTarget.value
                ? parseFloat(event.currentTarget.value)
                : undefined
            )
          }
        />
      </div>
      <div
        className="form-row"
        style={options.length > 1 ? undefined : { display: "none" }}
      >
        <div className="form-row-input">
          <select
            className="full-width"
            value={control(to)}
            onChange={handleChangeTo}
          >
            {renderOptions()}
          </select>
        </div>
      </div>
      {to === NEW_PARTICIPANT_OPTION && (
        <div className="form-row">
          <div className="form-row-input">
            <input
              type="text"
              placeholder="Name …"
              value={control(toNew)}
              onChange={(event: SyntheticEvent<HTMLInputElement>) =>
                onChange("toNew", event.currentTarget.value)
              }
              autoFocus={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DirectTransactionInput);
