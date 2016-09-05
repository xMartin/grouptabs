define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    formatData: function (accounts) {
      var round = function (amount) {
        return Math.round(amount * 100) / 100;
      };

      var getMaxAmount = function (accounts) {
        var result = 0;
        accounts.forEach(function (account) {
          var amount = Math.abs(account.amount);
          if (amount > result) {
            result = amount;
          }
        });
        return round(result);
      };

      var getCssColor = function (amount, maxAmount) {
        if (!maxAmount) {
          return 'transparent';
        }
        var color = amount < 0 ? [226, 91, 29] : [92, 226, 14];
        var opacity = Math.abs(amount) / maxAmount;
        color.push(opacity);
        return 'rgba(' + color.join(',') + ')';
      };

      var maxAmount = getMaxAmount(accounts);
      var data = accounts.map(function (account) {
        return {
          amount: round(account.amount),
          cssColor: getCssColor(account.amount, maxAmount),
          participant: account.participant
        };
      });

      return data;
    },

    render: function () {
      return (
        React.createElement('div', {id: 'summary'},
          React.createElement('table', {id: 'balance'},
            React.createElement('tbody', null,
              this.formatData(this.props.data).map(function (account) {
                return (
                  React.createElement('tr', {
                    key: account.participant,
                    style: {
                      backgroundColor: account.cssColor
                    }
                  },
                    React.createElement('th', {className: 'account'}, account.participant),
                    React.createElement('td', {className: 'amount'}, account.amount)
                  )
                );
              })
            )
          )
        )
      );
    }

  });

});
