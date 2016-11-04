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

      if (!this.validate(data)) {
        alert('Please fill in all fields and have at least two participants and one person who paid.');
        return;
      }

      data.transactionType = 'SHARED';
      data.date = new Date(data.date).toJSON();
      data.timestamp = new Date().toJSON();
      if (this.props.data) {
        this.props.handleUpdate(Object.assign({}, this.props.data, data));
      } else {
        this.props.handleCreate(data);
      }
    },

    validate: function (data) {
      if (!data.description) {
        return false;
      }

      if (!data.date) {
        return false;
      }

      var joinedParticipants = data.participants.filter(function (participant) {
        return participant;  // null if not joined or paid
      });

      if (joinedParticipants.length < 2) {
        return false;
      }

      // every joined participant needs a name
      for (var i = 0; i < joinedParticipants.length; i++) {
        if (!joinedParticipants[i].participant) {
          return false;
        }
      }

      var payingParticipants = joinedParticipants.filter(function (participant) {
        return participant.amount;
      });
      if (!payingParticipants.length) {
        return false;
      }

      return true;
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
