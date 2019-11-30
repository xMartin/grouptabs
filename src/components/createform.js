import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'CreateForm',

  propTypes: {
    onSubmit: PropTypes.func.isRequired
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var input = this.refs.input;
    var name = input.value.trim();
    if (name) {
      input.value = '';
      this.props.onSubmit(name);
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
