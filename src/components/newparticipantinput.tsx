import React, { PureComponent, SyntheticEvent } from 'react';
import ParticipantStatusInput from './participantstatusinput';
import { TransactionFormParticipantStatus as Status } from '../types';
import { control } from '../util/form';
import { PropsFromRedux } from '../app';

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: PropsFromRedux['onUpdateTransactionParticipant'];
}

export default class NewParticipantInput extends PureComponent<Props> {

  handleJoinedChange = () => {
    const status = this.props.status === Status.NONE ? Status.JOINED : Status.NONE;
    this.props.onChange(this.props.id, 'status', status);
  }

  handlePaidChange = () => {
    const status = this.props.status < Status.PAID ? Status.PAID : Status.JOINED;
    this.props.onChange(this.props.id, 'status', status);
  }

  render() {
    const { status, participant } = this.props;

    return (
      <div className={'newParticipantInput' + (status > Status.NONE ? ' selected' : '') + (status === 2 ? ' paid' : '')}>
        <span className='participant'>
          <input
            type='text'
            placeholder='Name …'
            value={control(participant)}
            onChange={(event: SyntheticEvent<HTMLInputElement>) => this.props.onChange(this.props.id, 'participant', event.currentTarget.value)}
            autoFocus={true}
          />
        </span>
        <ParticipantStatusInput
          status={status}
          onJoinedChange={this.handleJoinedChange}
          onPaidChange={this.handlePaidChange}
          onAmountChange={(amount?: number) => this.props.onChange(this.props.id, 'amount', amount)}
        />
      </div>
    );
  }

}
