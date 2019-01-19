define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  '../util/transaction'
],

function (React, createReactClass, PureRenderMixin, PropTypes, transactionUtils) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'TransactionListItem',

    propTypes: {
      data: PropTypes.object.isRequired,
      onDetailsClick: PropTypes.func.isRequired
    },

    formatData: function (data) {
      var round = function (amount) {
        return Math.round(amount * 100) / 100;
      };

      var result = {
        title: data.description
      };

      var transactionType = transactionUtils.getTransactionType(data);

      var paymentsList = (
        data.participants
        .filter(function (participant) {
          return transactionType === 'DIRECT' ? participant.amount > 0 : !!participant.amount;
        })
        .sort(function (a, b) {
          if (a.amount > b.amount || a.amount === b.amount && a.participant.toLowerCase() < b.participant.toLowerCase()) {
            return -1;
          }
          return 1;
        })
      );

      var payments = '';
      var total = 0;
      paymentsList.forEach(function (payment, idx) {
        payments += payment.participant + ': ' + round(payment.amount);

        if (idx < paymentsList.length - 1 || data.participants.length > paymentsList.length) {
          if (transactionType === 'DIRECT') {
            payments += ' → ';
          } else {
            payments += ', ';
          }
        }

        total += payment.amount;
      });
      result.payments = el('strong', null, payments);
      result.total = round(total);

      var participantsList = (
        data.participants
        .map(function (participant) {
          return participant.participant;
        })
        .sort(function (a, b) {
          return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
        })
      );

      var participants = '';
      participantsList.forEach(function (participant) {
        for (var i = 0, l = paymentsList.length; i < l; ++i) {
          if (paymentsList[i].participant === participant) {
            return;
          }
        }

        participants += participant + ', ';
      });
      result.participants = participants.substring(0, participants.length - 2);

      return result;
    },

    handleClick: function () {
      this.props.onDetailsClick(this.props.data.tabId, this.props.data.id);
    },

    render: function () {
      var data = this.formatData(this.props.data);

      return (
        el('div', {className: 'transaction', onClick: this.handleClick},
          el('table', null,
            el('tbody', null,
              el('tr', null,
                el('td', {className: 'title'},
                  data.title,
                  el('div', {className: 'payments'},
                    data.payments,
                    data.participants
                  )
                ),
                el('td', {className: 'total'},
                  data.total
                )
              )
            )
          )
        )
      );
    }

  });

});
