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
      var tabId = input.value.trim();
      if (tabId) {
        input.value = '';
        this.props.handleSubmit(tabId);
      }
    },

    render: function () {
      return (
        el('form', {onSubmit: this.handleSubmit, className: 'import-form'},
          el('div', {className: 'row-label'}, 'Open shared tab:'),
          el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID', ref: 'input'}),
          el('button', null, 'Open')
        )
      );
    }

  });

});
