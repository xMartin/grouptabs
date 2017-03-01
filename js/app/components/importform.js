define([
  'react'
],

function (React) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'ImportForm',

    propTypes: {
      checkingRemoteTab: React.PropTypes.bool,
      remoteTabError: React.PropTypes.string,
      handleSubmit: React.PropTypes.func.isRequired
    },

    componentWillReceiveProps: function (nextProps) {
      if (!nextProps.checkingRemoteTab && this.props.checkingRemoteTab && !nextProps.remoteTabError) {
        this.refs.input.value = '';
      }
    },

    handleSubmit: function (event) {
      event.preventDefault();
      var input = this.refs.input;
      var tabId = input.value.trim();
      if (tabId) {
        this.props.handleSubmit(tabId);
      }
    },

    render: function () {
      return (
        el('form', {onSubmit: this.handleSubmit, className: 'import-form'},
          el('input', {type: 'text', className: 'full-width', placeholder: 'Tab ID …', disabled: this.props.checkingRemoteTab, ref: 'input'}),
          el('button', {disabled: this.props.checkingRemoteTab}, this.props.checkingRemoteTab ? 'Checking…' : 'Open'),
          el('div', {className: 'error-message'}, this.props.remoteTabError)
        )
      );
    }

  });

});
