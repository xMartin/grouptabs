define([
  'react',
  './form'
],

function (React, FormClass) {
  'use strict';

  var Form = React.createFactory(FormClass);

  return React.createClass({

    getDefaultProps: function () {
      return {
        accounts: []
      };
    },

    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('div', {className: 'header'},
            React.createElement('button', {onClick: this.props.handleCloseClick}, '×'),
            React.createElement('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction')
          ),
          Form({mode: this.props.mode, data: this.props.data, accounts: this.props.accounts, handleCloseClick: this.props.handleCloseClick})
        )
      );
    }

  });

});
