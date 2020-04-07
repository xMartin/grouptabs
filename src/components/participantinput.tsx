import React, { PureComponent } from 'react';
import ParticipantStatusInput from './participantstatusinput';
import { TransactionFormParticipantStatus as Status } from '../types';
import { PropsFromRedux } from '../app';

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: PropsFromRedux['onUpdateTransactionParticipant'];
}

export default class ParticipantInput extends PureComponent<Props> {

  handleJoinedChange = () => {
    const status = this.props.status === Status.NONE ? Status.JOINED : Status.NONE;
    this.props.onChange(this.props.id, 'status', status);
  }

  handlePaidChange = () => {
    const status = this.props.status < Status.PAID ? Status.PAID : Status.JOINED;
    this.props.onChange(this.props.id, 'status', status);
  }

  render() {
    const { status, amount } = this.props;

    return (
      <div className={'participantInput' + (status > Status.NONE ? ' selected' : '') + (status === Status.PAID ? ' paid' : '')}>
        <span className='participant'>
          {this.props.participant}
        </span>
        <ParticipantStatusInput
          status={status}
          amount={amount}
          onJoinedChange={this.handleJoinedChange}
          onPaidChange={this.handlePaidChange}
          onAmountChange={(amount?: number) => this.props.onChange(this.props.id, 'amount', amount)}
        />
      </div>
    );
  }

}
