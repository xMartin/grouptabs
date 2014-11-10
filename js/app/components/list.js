define([
  'react',
  './transactionlist'
],

function (React, TransactionListClass) {
  'use strict';

  var TransactionList = React.createFactory(TransactionListClass);

  return React.createClass({

    getDefaultProps: function () {
      return {
        data: []
      };
    },

    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('div', {className: 'header'},
            React.createElement('button', null,
              React.createElement('svg', {height: 15, width: 15, style: {opacity: 0.5}},
                React.createElement('path', {d: 'm0 0v3h15v-3h-15zm0 6v3h15v-3h-15zm0 6v3h15v-3h-15z'})
              )
            ),
            React.createElement('h2', null, this.props.tabName)
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {className: 'full-width-margin create', onClick: this.props.handleNewEntryClick},
              'Add transaction'
            )
          ),
          React.createElement('div', {className: 'row toggle'},
            React.createElement('button', {onClick: this.props.handlePeopleClick}, 'People'),
            React.createElement('button', {disabled: 'disabled'}, 'Transactions')
          ),
          React.createElement('div', {className: 'row'},
            TransactionList({data: this.props.data, handleDetailsClick: this.props.handleDetailsClick})
          )
        )
      );
    }

  });

});
