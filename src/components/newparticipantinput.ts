import React, { PureComponent } from 'react';
import ParticipantStatusInput from './participantstatusinput';

var el = React.createElement;

interface Props {

}

interface State {
  status: 0 | 1 | 2;  // 0: none, 1: joined, 2: paid
}

export default class NewParticipantInput extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      status: 1
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
      this.setState({status: 2});
      setTimeout(() => {
        (this.refs.status as ParticipantStatusInput).focusAmount();
      });
    } else {
      this.setState({status: 1});
    }
  }

  getValue() {
    var participant = (this.refs.participant as HTMLInputElement).value.trim();
    var amount = this.state.status === 2 ? (this.refs.status as ParticipantStatusInput).getAmount() : 0;

    return {
      participant: participant,
      status: this.state.status,
      amount: amount
    };
  }

  setJoined() {
    if (this.state.status === 0) {
      this.setState({status: 1});
    }
  }

  focusParticipantInput() {
    (this.refs.participant as HTMLInputElement).focus();
  }

  render() {
    var status = this.state.status;

    return (
      el('div', {className: 'newParticipantInput' + (status > 0 ? ' selected' : '') + (status === 2 ? ' paid' : '')},
        el('span', {className: 'participant'},
          el('input', {type: 'text', placeholder: 'Name …', ref: 'participant'})
        ),
        el(ParticipantStatusInput, {
          status: status,
          onJoinedChange: this.handleJoinedChange,
          onPaidChange: this.handlePaidChange,
          // @ts-ignore
          ref: 'status'
        })
      )
    );
  }

}
