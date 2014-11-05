define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    getFormattedData: function () {
      var round = function (amount) {
        return Math.round(amount * 100) / 100;
      };

      var data = this.props.data;

      var result = {
        title: data.description
      };

      var paymentsList = [];
      data.participants.forEach(function (participant) {
        if (participant.amount) {
          paymentsList.push(participant);
        }
      });
      paymentsList.sort(function (a, b) {
        if (a.amount > b.amount || a.amount == b.amount && a.participant.toLowerCase() < b.participant.toLowerCase()) {
          return -1;
        }
        return 1;
      });

      var payments = '';
      var total = 0;
      paymentsList.forEach(function (payment, idx) {
        idx && (payments += ', ');
        payments += payment.participant + ': ' + round(payment.amount);
        total += payment.amount;
      });
      result.payments = payments;
      result.total = round(total);

      var participantsList = data.participants.map(function (participant) {
        return participant.participant;
      });
      participantsList.sort(function (a, b) {
        return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
      });

      var participants = '';
      participantsList.forEach(function (participant) {
        for (var i = 0, l = paymentsList.length; i < l; ++i) {
          if (paymentsList[i].participant == participant) {
            return;
          }
        }
        participants += ', ' + participant;
      });
      result.participants = participants;

      return result;
    },

    render: function () {
      var data = this.getFormattedData();
      return React.createElement('div', {className: 'transaction', onClick: this.handleClick},
        React.createElement('table', null,
          React.createElement('tr', null,
            React.createElement('td', {className:'title'},
              data.title,
              React.createElement('div', {className: 'payments'},
                data.payments,
                data.participants
              )
            ),
            React.createElement('td', {className: 'total'},
              data.total
            )
          )
        )
      )
    },

    handleClick: function () {
      this.props.handleDetailsClick(this.props.data);
    }

  });

});
