define([
  'react'
],

function (React) {
  'use strict';

  return React.createClass({

    render: function () {
      return (
        React.createElement('form', {onSubmit: this.handleSubmit, className: 'import-form'},
          React.createElement('div', {className: 'row-label'}, 'Import existing tab:'),
          React.createElement('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID', ref: 'input'}),
          React.createElement('button', {className: 'create'}, 'Import')
        )
      );
    },

    handleSubmit: function (event) {
      event.preventDefault();
      var input = this.refs.input.getDOMNode();
      var tab = input.value.trim();
      if (tab) {
        input.value = '';
        tab && this.props.handleSubmit(tab);
      }
    }

  });

});
