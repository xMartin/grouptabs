import React, { FunctionComponent, memo } from "react";
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
}) => (
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
              onChange={onChangeParticipant}
            />
          );
        }
      })}
    </div>
  </div>
);

export default memo(ParticipantsInputList);
