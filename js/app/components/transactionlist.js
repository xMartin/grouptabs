define([
  'react',
  'create-react-class',
  'pure-render-mixin',
  'prop-types',
  '../util/date',
  './transactionlistitem'
],

function (React, createReactClass, PureRenderMixin, PropTypes, dateUtils, TransactionListItem) {
  'use strict';

  var el = React.createElement;

  return createReactClass({
    mixins: [PureRenderMixin],

    displayName: 'TransactionList',

    propTypes: {
      data: PropTypes.arrayOf(PropTypes.object).isRequired,
      onDetailsClick: PropTypes.func.isRequired
    },

    getStructuredData: function () {
      var transactions = this.props.data;
      if (!transactions.length) {
        return transactions;
      }
      // XXX Refactor structuring of date groups with a proper loop
      var date = dateUtils.formatHumanDate(transactions[0].date);
      var dateGroups = [];
      var dateGroupTransactions = [];
      transactions.forEach(function (transaction) {
        var currentDate = dateUtils.formatHumanDate(transaction.date);
        if (currentDate !== date) {
          dateGroups.push({
            date: date,
            transactions: dateGroupTransactions
          });
          dateGroupTransactions = [];
        }
        dateGroupTransactions.push(transaction);
        date = dateUtils.formatHumanDate(transaction.date);
      });
      dateGroups.push({
        date: date,
        transactions: dateGroupTransactions
      });
      return dateGroups;
    },

    render: function () {
      return (
        el('div', {id: 'transactions'},
          el('div', null,
            this.getStructuredData().map(function (dateGroup) {
              return (
                el('div', {key: dateGroup.date},
                  el('div', {className: 'dategroup'},
                    dateGroup.date
                  ),
                  dateGroup.transactions.map(function (transaction) {
                    return el(TransactionListItem, {
                      key: transaction.timestamp + '_' + transaction.description,
                      data: transaction,
                      onDetailsClick: this.props.onDetailsClick
                    });
                  }.bind(this))
                )
              );
            }.bind(this))
          )
        )
      );
    }

  });

});
