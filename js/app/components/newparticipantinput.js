define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    // status:
    //   0: none
    //   1: joined
    //   2: paid

    getInitialState: function () {
      return {
        status: 0
      };
    },

    render: function () {
      return (
        React.createElement('div', {className: 'newParticipantInput'},
          React.createElement('span', {className: 'participant'},
            React.createElement('input', {type: 'text', placeholder: 'Name …', ref: 'participant'})
          ),
          React.createElement('span', {className: 'participationStatus'},
            React.createElement('input', {
              type: 'checkbox',
              checked: this.state.status > 0,
              id: 'joined' + this._rootNodeID,
              ref: 'joined',
              onChange: this.handleJoinedChange
            }),
            React.createElement('label', {htmlFor: 'joined' + this._rootNodeID}, 'joined'),
            React.createElement('input', {
              type: 'checkbox',
              checked: this.state.status === 2,
              id: 'paid' + this._rootNodeID,
              ref: 'paid',
              onChange: this.handlePaidChange
            }),
            React.createElement('label', {htmlFor: 'paid' + this._rootNodeID}, 'paid'),
            React.createElement('input', {
              type: 'number',
              className: this.state.status < 2 ? 'hidden' : '',
              defaultValue: this.props.value && this.props.value.amount || '',
              ref: 'amount'
            })
          )
        )
      );
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
        this.setState({status: 2});
      } else {
        this.setState({status: 1});
      }
    },

    getValue: function () {
      if (this.state.status === 0) {
        return null;
      }
      return {
        participant: this.refs.participant.getDOMNode().value,
        amount: this.state.status === 2 ? parseFloat(this.refs.amount.getDOMNode().value || 0) : 0
      };
    },

    setJoined: function () {
      if (this.state.status === 0) {
        this.setState({status: 1});
      }
    }

  });

});
