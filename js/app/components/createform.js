define([
  'react',
  'create-react-class',
  'prop-types'
],

function (React, createReactClass, PropTypes) {
  'use strict';

  var el = React.createElement;

  return createReactClass({

    displayName: 'CreateForm',

    propTypes: {
      handleSubmit: PropTypes.func.isRequired
    },

    handleSubmit: function (event) {
      event.preventDefault();
      var input = this.refs.input;
      var name = input.value.trim();
      if (name) {
        input.value = '';
        this.props.handleSubmit(name);
      }
    },

    render: function () {
      return (
        el('form', {onSubmit: this.handleSubmit, className: 'create-form'},
          el('input', {type: 'text', className: 'full-width', placeholder: 'Tab name …', ref: 'input'}),
          el('button', {className: 'create'}, 'Create')
        )
      );
    }

  });

});
