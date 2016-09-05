define([
  'react',
  './form'
],

function (React, Form) {
  'use strict';

  var el = React.createElement;

  return React.createClass({

    getValues: function () {
      return this.refs.form.getValues();
    },

    handleSubmit: function () {
      var data = this.getValues();
      data.type = 'SHARED';
      data.date = (new Date(data.date)).getTime();
      if (this.props.data) {
        data._id = this.props.data._id;
        data._rev = this.props.data._rev;
      } else {
        data.timestamp = (new Date()).getTime();
      }
      this.props.handleSubmit(data);
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
