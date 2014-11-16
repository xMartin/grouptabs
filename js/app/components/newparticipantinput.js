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
        status: 1
      };
    },

    render: function () {
      return (
        React.createElement('div', {className: 'newParticipantInput' + (this.state.status > 0 ? ' selected' : '')},
          React.createElement('span', {className: 'participant'},
            React.createElement('input', {type: 'text', placeholder: 'Name …', ref: 'participant'})
          ),
          React.createElement('span', {className: 'participationStatus'},
            React.createElement('span', {className: 'joinedButtonWrapper' + (this.state.status === 2 ? ' hidden' : '')},
              React.createElement('button', {
                type: 'button',
                className: this.state.status > 0 ? ' selected' : '',
                ref: 'joined',
                onClick: this.handleJoinedChange
              }, 'joined')
            ),
            React.createElement('button', {
              type: 'button',
              className: 'paid-button' + (this.state.status === 2 ? ' selected' : ''),
              ref: 'paid',
              onClick: this.handlePaidChange
            }, 'paid'),
            React.createElement('span', {className: 'amountInput' + (this.state.status < 2 ? ' hidden' : '')},
              React.createElement('input', {
                type: 'number',
                defaultValue: this.props.value && this.props.value.amount || '',
                ref: 'amount'
              })
            )
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
        setTimeout(function(){
          this.refs.amount.getDOMNode().focus();
        }.bind(this));
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
