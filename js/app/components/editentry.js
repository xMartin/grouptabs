define([
  'react',
  './form'
],

function (React, Form) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    displayName: 'EditEntry',

    getValues: function () {
      return this.refs.form.getValues();
    },

    handleSubmit: function () {
      var data = this.getValues();
      data.transactionType = 'SHARED';
      data.date = new Date(data.date).toJSON();
      if (this.props.data) {
        this.props.handleUpdate(Object.assign({}, this.props.data, data));
      } else {
        data.timestamp = new Date().toJSON();
        this.props.handleCreate(data);
      }
    },

    handleDelete: function () {
      this.props.handleDelete(this.props.data);
    },

    render: function () {
      return (
        el('div', {className: 'scene editEntryScene'},
          el('div', {className: 'header'},
            el('button', {onClick: this.props.handleCloseClick}, '×'),
            el('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction')
          ),
          el(Form, {
            mode: this.props.mode,
            data: this.props.data,
            participants: this.props.participants,
            handleCloseClick: this.props.handleCloseClick,
            handleSubmit: this.handleSubmit,
            handleDelete: this.handleDelete,
            ref: 'form'
          })
        )
      );
    }

  });

});
