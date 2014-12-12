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
        React.createElement('div', {className: 'scene listScene' + (this.props.visible ? '' : ' hidden')},
          React.createElement('div', {className: 'header'},
            React.createElement('button', {onClick: this.props.handleChangeTabClick},
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
            React.createElement('button', {className: 'tab', onClick: this.props.handlePeopleClick}, 'People'),
            React.createElement('button', {className: 'tab active', disabled: 'disabled'}, 'Transactions')
          ),
          React.createElement('div', {className: 'row'},
            new TransactionList({data: this.props.data, handleDetailsClick: this.props.handleDetailsClick})
          )
        )
      );
    }

  });

});
