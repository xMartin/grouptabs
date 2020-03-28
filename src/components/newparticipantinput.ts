import React, { PureComponent, SyntheticEvent } from 'react';
import ParticipantStatusInput from './participantstatusinput';
import { TransactionFormParticipantStatus as Status, TransactionFormSharedState } from '../types';
import { control } from '../util/form';

var el = React.createElement;

interface Props {
  id: string;
  participant?: string;
  status: Status;
  amount?: number;
  onChange: <K extends 'participant' | 'status' | 'amount'>(id: string, key: K, value: TransactionFormSharedState[K]) => void;
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
      el('div', {className: 'newParticipantInput' + (status > Status.NONE ? ' selected' : '') + (status === 2 ? ' paid' : '')},
        el('span', {className: 'participant'},
          el('input', {
            type: 'text',
            placeholder: 'Name …',
            value: control(participant),
            onChange: (event: SyntheticEvent<HTMLInputElement>) => this.props.onChange(this.props.id, 'participant', event.currentTarget.value),
            autoFocus: true,
          })
        ),
        el(ParticipantStatusInput, {
          status,
          onJoinedChange: this.handleJoinedChange,
          onPaidChange: this.handlePaidChange,
          onAmountChange: (amount?: number) => this.props.onChange(this.props.id, 'amount', amount),
        })
      )
    );
  }

}
