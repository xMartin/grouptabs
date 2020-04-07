import React, { PureComponent } from 'react';
import ParticipantInput from './participantinput';
import NewParticipantInput from './newparticipantinput';
import { TransactionFormState, TransactionFormParticipantInputType } from '../types';
import { PropsFromRedux } from '../app';

interface Props {
  inputs: TransactionFormState['shared'];
  onChangeParticipant: PropsFromRedux['onUpdateTransactionParticipant'];
}

export default class ParticipantsInputList extends PureComponent<Props> {

  render() {
    return (
      <div className='form-row'>
        <div className='form-row-input'>
          {this.props.inputs.map(({ inputType, id, participant, status, amount }) => {
            if (inputType === TransactionFormParticipantInputType.EXISTING) {
              return <ParticipantInput
                key={id}
                id={id}
                participant={participant}
                status={status}
                amount={amount}
                onChange={this.props.onChangeParticipant}
              />;
            } else {
              return <NewParticipantInput
                key={id}
                id={id}
                participant={participant}
                status={status}
                amount={amount}
                onChange={this.props.onChangeParticipant}
              />;
            }
          })}
        </div>
      </div>
    );
  }

}
