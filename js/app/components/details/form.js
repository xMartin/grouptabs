define([
  'react'
],

function (React) {
  'use strict';

//  var TransactionList = React.createFactory(TransactionListClass);

  return React.createClass({

    getInitialState: function () {
      return {
        date: new Date().toLocaleString()
      };
    },

    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('div', {className: 'header'},
            React.createElement('button', {onClick: this.props.handleCloseClick}, '×'),
            React.createElement('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction')
          ),
          React.createElement('form', {className: 'form'},
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {type: 'text', name: 'description', placeholder: 'Description'})
              ),
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {type: 'date', name: 'date', value: this.state.date})
              )
            ),
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('button', null, '+ new participant'),
                React.createElement('button', null, '✓ all joined')
              )
            )
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {className: 'delete'}, 'Delete'),
            React.createElement('button', {className: 'create full-width-margin'}, 'Save')
          )
        )
      );
    }

  });

});
