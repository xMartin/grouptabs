import React, { PureComponent } from 'react';
import ParticipantStatusInput from './participantstatusinput';

var el = React.createElement;

interface Props {
  participant: string;
  value?: { amount: number };
}

interface State {
  status: 0 | 1 | 2;  // 0: none, 1: joined, 2: paid
}

export default class ParticipantInput extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    var status: State['status'] = 0;

    if (props.value) {
      if (props.value.amount) {
        status = 2;
      } else {
        status = 1;
      }
    }
    this.state = {
      status: status
    };
  }

  handleJoinedChange() {
    if (this.state.status === 0) {
      this.setState({status: 1});
    } else {
      this.setState({status: 0});
    }
  }

  handlePaidChange() {
    if (this.state.status < 2) {
      this.setState({status: 2}, (this.refs.status as ParticipantStatusInput).focusAmount);
    } else {
      this.setState({status: 1});
    }
  }

  getValue() {
    var amount = this.state.status === 2 ? (this.refs.status as ParticipantStatusInput).getAmount() : 0;

    return {
      participant: this.props.participant,
      status: this.state.status,
      amount: amount
    };
  }

  setJoined() {
    if (this.state.status === 0) {
      this.setState({status: 1});
    }
  }

  render() {
    var status = this.state.status;

    return (
      el('div', {className: 'participantInput' + (status > 0 ? ' selected' : '') + (status === 2 ? ' paid' : '')},
        el('span', {className: 'participant'},
          this.props.participant
        ),
        el(ParticipantStatusInput, {
          status: status,
          amount: this.props.value ? this.props.value.amount : undefined,
          onJoinedChange: this.handleJoinedChange,
          onPaidChange: this.handlePaidChange,
          // @ts-ignore
          ref: 'status'
        })
      )
    );
  }

}
