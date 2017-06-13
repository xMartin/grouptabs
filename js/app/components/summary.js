define([
  'react',
  'create-react-class'
],

function (React, createReactClass) {
  'use strict';

  var el = React.createElement;

  return createReactClass({

    displayName: 'Summary',

    propTypes: {
      data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired
    },

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
        el('div', {id: 'summary'},
          el('table', {id: 'balance'},
            el('tbody', null,
              this.formatData(this.props.data).map(function (account) {
                return (
                  el('tr', {
                    key: account.participant,
                    style: {
                      backgroundColor: account.cssColor
                    }
                  },
                    el('th', {className: 'account'}, account.participant),
                    el('td', {className: 'amount'}, account.amount)
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
