define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'ImportForm',

    handleSubmit: function (event) {
      event.preventDefault();
      var input = this.refs.input;
      var tab = input.value.trim();
      if (tab) {
        input.value = '';
        tab && this.props.handleSubmit(tab);
      }
    },

    render: function () {
      return (
        el('form', {onSubmit: this.handleSubmit, className: 'import-form'},
          el('div', {className: 'row-label'}, 'Import existing tab:'),
          el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID', ref: 'input'}),
          el('button', {className: 'create'}, 'Import')
        )
      );
    }

  });

});
