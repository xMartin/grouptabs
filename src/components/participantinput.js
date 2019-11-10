import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';
import ParticipantStatusInput from './participantstatusinput';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'ParticipantInput',

  propTypes: {
    participant: PropTypes.string.isRequired,
    value: PropTypes.object
  },

  getInitialState: function () {
    // 0: none, 1: joined, 2: paid
    var status = 0;

    if (this.props.value) {
      if (this.props.value.amount) {
        status = 2;
      } else {
        status = 1;
      }
    }
    return {
      status: status
    };
  },

  handleJoinedChange: function () {
    if (this.state.status === 0) {
      this.setState({status: 1});
    } else {
      this.setState({status: 0});
    }
  },

  handlePaidChange: function () {
    if (this.state.status < 2) {
      this.setState({status: 2}, this.refs.status.focusAmount);
    } else {
      this.setState({status: 1});
    }
  },

  getValue: function () {
    var amount = this.state.status === 2 ? this.refs.status.getAmount() : 0;

    return {
      participant: this.props.participant,
      status: this.state.status,
      amount: amount
    };
  },

  setJoined: function () {
    if (this.state.status === 0) {
      this.setState({status: 1});
    }
  },

  render: function () {
    var status = this.state.status;

    return (
      el('div', {className: 'participantInput' + (status > 0 ? ' selected' : '') + (status === 2 ? ' paid' : '')},
        el('span', {className: 'participant'},
          this.props.participant
        ),
        el(ParticipantStatusInput, {
          status: status,
          amount: this.props.value && this.props.value.amount || undefined,
          onJoinedChange: this.handleJoinedChange,
          onPaidChange: this.handlePaidChange,
          ref: 'status'
        })
      )
    );
  }

});
