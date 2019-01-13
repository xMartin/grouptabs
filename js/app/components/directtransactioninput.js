define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types'
],

function (React, createReactClass, PureRenderMixin, PropTypes) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'DirectTransactionInput',

    propTypes: {
      tabParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,
      participants: PropTypes.arrayOf(PropTypes.object).isRequired
    },

    getValues: function () {
      return {
        from: this.refs.from.value,
        to: this.refs.to.value,
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

    render: function () {
      var inputProps = this.participants2Inputs(this.props.participants);

      return (
        el('div', {className: 'direct-transaction'},
          el('select', {ref: 'from'},
            this.props.tabParticipants.map(function (participant) {
              return el('option', {key: participant, selected: participant === inputProps.from}, participant);
            })
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
          el('select', {ref: 'to'},
            this.props.tabParticipants.map(function (participant) {
              return el('option', {key: participant, selected: participant === inputProps.to}, participant);
            })
          )
        )
      );
    }

  });

});
