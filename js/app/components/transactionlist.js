define([
  'react',
  './transactionlistitem'
],

function (React, TransactionListItemClass) {
  'use strict';

  var TransactionListItem = React.createFactory(TransactionListItemClass);

  return React.createClass({

    getStructuredData: function () {
      var transactions = this.props.data;
      if (!transactions.length) {
        return transactions;
      }
      // XXX Refactor structuring of date groups with a proper loop
      var date = new Date(transactions[0].date).toLocaleDateString();
      var dateGroups = [];
      var dateGroupTransactions = [];
      transactions.forEach(function (transaction) {
        var currentDate = new Date(transaction.date).toLocaleDateString();
        if (currentDate !== date) {
          dateGroups.push({
            date: date,
            transactions: dateGroupTransactions
          });
          dateGroupTransactions = [];
        }
        dateGroupTransactions.push(transaction);
        date = new Date(transaction.date).toLocaleDateString();
      });
      dateGroups.push({
        date: date,
        transactions: dateGroupTransactions
      });
      return dateGroups;
    },

    render: function () {
      var dateGroups = this.getStructuredData().map(function (dateGroup) {
        var transactions = dateGroup.transactions.map(function (transaction) {
          return new TransactionListItem({data: transaction, handleDetailsClick: this.props.handleDetailsClick});
        }.bind(this));
        return (
          React.createElement('div', null,
            React.createElement('div', {className: 'dategroup'},
              dateGroup.date
            ),
            transactions
          )
        );
      }.bind(this));
      return (
        React.createElement('div', {id: 'transactions'},
          React.createElement('div', null, dateGroups)
        )
      );
    }

  });

});
