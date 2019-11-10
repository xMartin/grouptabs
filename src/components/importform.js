import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'pure-render-mixin';
import PropTypes from 'prop-types';

var el = React.createElement;

export default createReactClass({
  mixins: [PureRenderMixin],

  displayName: 'ImportForm',

  propTypes: {
    checkingRemoteTab: PropTypes.bool,
    remoteTabError: PropTypes.string,
    onSubmit: PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.refs.input.focus();
  },

  componentDidUpdate: function (prevProps) {
    if (!this.props.checkingRemoteTab && prevProps.checkingRemoteTab && !this.props.remoteTabError) {
      this.refs.input.value = '';
    }
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var input = this.refs.input;
    var tabId = input.value.trim();
    if (tabId) {
      this.props.onSubmit(tabId);
    }
  },

  render: function () {
    return (
      el('form', {onSubmit: this.handleSubmit, className: 'import-form'},
        el('div', {className: 'row-label'}, 'Open shared tab:'),
        el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID …', disabled: this.props.checkingRemoteTab, ref: 'input'}),
        el('button', {disabled: this.props.checkingRemoteTab}, this.props.checkingRemoteTab ? 'Checking…' : 'Open'),
        el('div', {className: 'error-message'}, this.props.remoteTabError)
      )
    );
  }

});
