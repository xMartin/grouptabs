define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    getInitialState: function () {
      return {
        data: []
      };
    },

    render: function () {
      var accounts = this.state.data.map(function (account) {
        return React.createElement('tr', {style: {backgroundColor: account.cssColor}},
          React.createElement('th', {className: 'account'}, account.participant),
          React.createElement('td', {className: 'amount'}, account.amount)
        );
      });
      return React.createElement('table', {id: 'balance'}, accounts);
    }

  });

});
