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
        el(React.Fragment, null,
          el('select', {ref: 'from'},
            this.props.tabParticipants.map(function (participant) {
              return el('option', {key: participant, selected: participant === inputProps.from}, participant);
            })
          ),
          el('div', null,
            el('svg', {height: 16, width: 16},
              el('path', {d: 'm8.5 0.5c-0.8974 0-1.3404 1.0909-0.6973 1.7168l4.7837 4.7832h-11.573c-1.3523-0.019125-1.3523 2.0191 0 2h11.572l-4.7832 4.7832c-0.98163 0.94251 0.47155 2.3957 1.4141 1.4141l6.4911-6.49c0.387-0.3878 0.391-1.0228 0-1.414l-6.4906-6.4903c-0.1883-0.1935-0.4468-0.30268-0.7168-0.3027z'})
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
