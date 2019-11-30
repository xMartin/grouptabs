import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

var newParticipantOption = 'New participant…';

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'DirectTransactionInput',

  propTypes: {
    accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
    participants: PropTypes.arrayOf(PropTypes.object).isRequired
  },

  getInitialState: function () {
    var inputProps = this.participants2Inputs(this.props.participants);
    var accounts = this.props.accounts;
    var mostNegativeParticipant = accounts[0] && accounts[0].participant;
    var mostPositiveParticipant = accounts[accounts.length - 1] && accounts[accounts.length - 1].participant;
    return {
      fromValue: inputProps.from || mostNegativeParticipant || newParticipantOption,
      toValue: inputProps.to || mostPositiveParticipant || newParticipantOption
    };
  },

  getValues: function () {
    return {
      from: this.state.fromValue === newParticipantOption ? this.refs.fromNew.value : this.state.fromValue,
      to: this.state.toValue === newParticipantOption ? this.refs.toNew.value : this.state.toValue,
      amount: parseFloat(this.refs.amount.value || 0)
    };
  },

  participants2Inputs: function (participants) {
    var result = {};

    for (var i = 0; i < participants.length; ++i) {
      var participant = participants[i];

      if (!result.amount) {
        result.amount = Math.abs(participant.amount);
      }

      if (!result.from && participant.amount > 0) {
        result.from = participant.participant;
      }

      if (!result.to && participant.amount < 0) {
        result.to = participant.participant;
      }
    }

    return result;
  },

  handleChangeFrom: function (event) {
    this.setState({
      fromValue: event.currentTarget.value
    }, function () {
      if (this.state.fromValue === newParticipantOption) {
        this.refs.fromNew.focus();
      }
    }.bind(this));
  },

  handleChangeTo: function (event) {
    this.setState({
      toValue: event.currentTarget.value
    }, function () {
      if (this.state.toValue === newParticipantOption) {
        this.refs.toNew.focus();
      }
    }.bind(this));
  },

  render: function () {
    var inputProps = this.participants2Inputs(this.props.participants);
    var tabParticipants = this.props.accounts.map(function (account) {
      return account.participant;
    });
    var showFromNewParticipant = this.state.fromValue === newParticipantOption || !tabParticipants.length;
    var showToNewParticipant = this.state.toValue === newParticipantOption || !tabParticipants.length;
    var options = tabParticipants.concat(newParticipantOption);

    return (
      el('div', {className: 'direct-transaction'},
        el('div', {className: 'form-row', style: tabParticipants.length ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('select',
              {
                ref: 'from',
                className: 'full-width',
                value: this.state.fromValue,
                onChange: this.handleChangeFrom
              },
              options.map(function (participant) {
                return el('option', {key: participant}, participant);
              })
            )
          )
        ),
        el('div', {className: 'form-row', style: showFromNewParticipant ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('input', {
              ref: 'fromNew',
              type: 'text',
              placeholder: 'Name …'
            })
          )
        ),
        el('div', {className: 'direct-transaction-amount'},
          el('svg', {height: 16, width: 16},
            el('path', {d: 'm15.511 8.5129c0-0.8974-1.0909-1.3404-1.7168-0.6973l-4.7832 4.7837v-11.573c0.019125-1.3523-2.0191-1.3523-2 0v11.572l-4.7832-4.7832c-0.94251-0.98163-2.3957 0.47155-1.4141 1.4141l6.49 6.4911c0.3878 0.387 1.0228 0.391 1.414 0l6.4903-6.4906c0.1935-0.1883 0.30268-0.4468 0.3027-0.7168z'})
          ),
          el('input', {
            ref: 'amount',
            type: 'number',
            step: 'any',
            placeholder: 0,
            defaultValue: inputProps.amount
          })
        ),
        el('div', {className: 'form-row', style: tabParticipants.length ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('select',
              {
                ref: 'to',
                className: 'full-width',
                value: this.state.toValue,
                onChange: this.handleChangeTo
              },
              options.map(function (participant) {
                return el('option', {key: participant}, participant);
              })
            )
          )
        ),
        el('div', {className: 'form-row', style: showToNewParticipant ? null : {display: 'none'}},
          el('div', {className: 'form-row-input'},
            el('input', {
              ref: 'toNew',
              type: 'text',
              placeholder: 'Name …'
            })
          )
        )
      )
    );
  }

});
