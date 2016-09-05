define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    render: function () {
      return (
        el('span', {className: 'participationStatus'},
          el('span', {className: 'joinedButtonWrapper' + (this.props.status === 2 ? ' hidden' : '')},
            el('button', {
              type: 'button',
              className: this.props.status > 0 ? ' selected' : '',
              ref: 'joined',
              onClick: this.props.handleJoinedChange
            }, 'joined')
          ),
          el('button', {
            type: 'button',
            className: 'paid-button' + (this.props.status === 2 ? ' selected' : ''),
            ref: 'paid',
            onClick: this.props.handlePaidChange
          }, 'paid'),
          el('span', {className: 'amountInput' + (this.props.status < 2 ? ' hidden' : '')},
            el('input', {
              type: 'number',
              disabled: this.props.status !== 2 ? 'disabled' : '',
              defaultValue: this.props.amount,
              ref: 'amount'
            })
          )
        )
      );
    },

    getAmount: function () {
      return parseFloat(this.refs.amount.value || 0);
    },

    focusAmount: function () {
      this.refs.amount.focus();
    }

  });

});
