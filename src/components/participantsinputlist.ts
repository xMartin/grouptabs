import React, { PureComponent } from 'react';
import ParticipantInput from './participantinput';
import NewParticipantInput from './newparticipantinput';
import { TransactionFormState, TransactionFormParticipantInputType } from '../types';
import { PropsFromRedux } from '../app';

var el = React.createElement;

interface Props {
  inputs: TransactionFormState['shared'];
  onChangeParticipant: PropsFromRedux['onUpdateTransactionParticipant'];
}

export default class ParticipantsInputList extends PureComponent<Props> {

  render() {
    return (
      el('div', {className: 'form-row'},
        el('div', {className: 'form-row-input'},
          this.props.inputs.map(({ inputType, id, participant, status, amount }) => {
            if (inputType === TransactionFormParticipantInputType.EXISTING) {
              return el(ParticipantInput, {
                key: id,
                id,
                participant,
                status,
                amount,
                onChange: this.props.onChangeParticipant,
              });
            } else {
              return el(NewParticipantInput, {
                key: id,
                id,
                participant,
                status,
                amount,
                onChange: this.props.onChangeParticipant,
              });
            }
          })
        )
      )
    );
  }

}
