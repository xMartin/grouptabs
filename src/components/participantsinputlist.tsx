import { FunctionComponent, memo, useEffect, useRef } from "react";
import ParticipantInput from "./participantinput";
import NewParticipantInput from "./newparticipantinput";
import {
  TransactionFormState,
  TransactionFormParticipantInputType,
} from "../types";
import { PropsFromRedux } from "../app";

interface Props {
  inputs: TransactionFormState["shared"];
  onChangeParticipant: PropsFromRedux["onUpdateTransactionParticipant"];
}

const ParticipantsInputList: FunctionComponent<Props> = ({
  inputs,
  onChangeParticipant,
}) => {
  const readyForNewParticipantNameAutoFocus = useRef<boolean>(false);
  // set ready for auto focus on mount so inputs will only focus when they appear later
  useEffect(() => {
    readyForNewParticipantNameAutoFocus.current = true;
  }, []);

  return (
    <div className="form-row">
      <div className="form-row-input">
        {inputs.map(({ inputType, id, participant, status, amount }) => {
          if (inputType === TransactionFormParticipantInputType.EXISTING) {
            return (
              <ParticipantInput
                key={id}
                id={id}
                participant={participant}
                status={status}
                amount={amount}
                onChange={onChangeParticipant}
              />
            );
          } else {
            return (
              <NewParticipantInput
                key={id}
                id={id}
                participant={participant}
                status={status}
                amount={amount}
                autoFocusNameInput={readyForNewParticipantNameAutoFocus.current}
                onChange={onChangeParticipant}
              />
            );
          }
        })}
      </div>
    </div>
  );
};

export default memo(ParticipantsInputList);
