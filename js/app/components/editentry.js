define([
  'react',
  './form'
],

function (React, FormClass) {
  'use strict';

  var Form = React.createFactory(FormClass);

  return React.createClass({

    render: function () {
      return (
        React.createElement('div', {className: 'scene editEntryScene'},
          React.createElement('div', {className: 'header'},
            React.createElement('button', {onClick: this.props.handleCloseClick}, '×'),
            React.createElement('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction')
          ),
          new Form({
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
    },

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
    }

  });

});
