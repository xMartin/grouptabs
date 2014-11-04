define([
  'react',
  '../components/transactionlist'
],

function (React, TransactionListClass) {
  'use strict';

  var TransactionList = React.createFactory(TransactionListClass);

  return React.createClass({

    getInitialState: function () {
      return {
        data: []
      };
    },

    render: function () {
      return React.createElement('div', null,
        React.createElement('div', {className: 'header'},
          React.createElement('button', null,
            React.createElement('svg', {height: 15, width: 15, style: {opacity: 0.5}},
              React.createElement('path', {d: 'm0 0v3h15v-3h-15zm0 6v3h15v-3h-15zm0 6v3h15v-3h-15z'})
            )
          ),
          React.createElement('h2', null, this.state.tabName)
        ),
        React.createElement('div', {className: 'row'},
          React.createElement('button', {className: 'full-width-margin create', onClick: this._onNewEntryClick},
            'Add transaction'
          )
        ),
        React.createElement('div', {className: 'row toggle'},
          React.createElement('button', {onClick: this._onPeopleClick}, 'People'),
          React.createElement('button', {disabled: 'disabled'}, 'Transactions')
        ),
        React.createElement('div', {className: 'row'},
          TransactionList({data: this.state.data})
        )
      );
    },

    _onChangeTabClick: function () {
      this.props.view._onChangeTabClick();
    },

    _onNewEntryClick: function () {
      this.props.view._onNewEntryClick();
    },

    _onSummaryClick: function () {
      this.props.view._onSummaryClick();
    },

    _onPeopleClick: function () {
      this.props.view._onPeopleClick();
    }

  });

});
