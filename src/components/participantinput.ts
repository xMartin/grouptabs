import React, { PureComponent } from 'react';
import ParticipantStatusInput from './participantstatusinput';
import { TransactionFormParticipantStatus as Status, TransactionFormSharedState } from '../types';

var el = React.createElement;

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: <K extends 'status' | 'amount'>(id: string, key: K, value: TransactionFormSharedState[K]) => void;
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
      el('div', {className: 'participantInput' + (status > Status.NONE ? ' selected' : '') + (status === Status.PAID ? ' paid' : '')},
        el('span', {className: 'participant'},
          this.props.participant
        ),
        el(ParticipantStatusInput, {
          status,
          amount,
          onJoinedChange: this.handleJoinedChange,
          onPaidChange: this.handlePaidChange,
          onAmountChange: (amount?: number) => this.props.onChange(this.props.id, 'amount', amount)
        })
      )
    );
  }

}
