define([
  'react',
  './participantinput',
  './newparticipantinput'
],

function (React, ParticipantInputClass, NewParticipantInputClass) {
  'use strict';

  var ParticipantInput = React.createFactory(ParticipantInputClass);
  var NewParticipantInput = React.createFactory(NewParticipantInputClass);

  return React.createClass({

    getInitialState: function () {
      return {
        newParticipantsCount: this.props.participants.length < 2 ? 2 : 0
      };
    },

    formatDate: function (date) {
      date = date || new Date();
      var month = date.getMonth() + 1;
      month = month < 10 ? '0' + month : month;
      var day = date.getDate();
      day = day < 10 ? '0' + day : day;
      return '' + date.getFullYear() + '-' + month + '-' + day;
    },

    findParticipantDefaultValue: function (participant) {
      var value = null;
      this.props.data.participants.forEach(function (participantValue) {
        if (participantValue.participant === participant) {
          value = participantValue;
        }
      });
      return value;
    },

    render: function () {
      var mode = this.props.mode;

      var participantPropsList = this.props.participants.map(function (participant, idx) {
        var props = {
          participant: participant,
          ref: 'participant' + idx
        };
        if (mode === 'edit') {
          props.value = this.findParticipantDefaultValue(participant)
        }
        return props;
      }.bind(this));
      participantPropsList.sort(function (a, b) {
        var sortableValue = function (value) {
          return value ? value.amount : 0;
        }
        return sortableValue(a.value) > sortableValue(b.value) ? -1 : 1;
      });
      var participantInputs = participantPropsList.map(function (props) {
        return new ParticipantInput(props);
      });

      var newParticipantInputs = (function () {
        var result = [];
        for (var i = 0; i < this.state.newParticipantsCount; ++i) {
          result.push(new NewParticipantInput({ref: 'participant' + participantInputs.length + i}));
        }
        return result;
      }.bind(this))();

      return (
        React.createElement('form', {onSubmit: this.handleSubmit},
          React.createElement('div', {className: 'form'},
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {
                  type: 'text',
                  placeholder: 'Description',
                  defaultValue: mode === 'edit' ? this.props.data.description : '',
                  ref: 'description'
                })
              ),
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {
                  type: 'date',
                  defaultValue: this.formatDate(mode === 'edit' ? new Date(this.props.data.date) : new Date()),
                  ref: 'date'
                })
              )
            ),
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                participantInputs,
                newParticipantInputs
              )
            ),
            React.createElement('div', {className: 'form-row'},
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('button', {type: 'button', onClick: this.handleAddParticipant}, '+ new participant'),
                React.createElement('button', {type: 'button', onClick: this.handleAllJoined}, '✓ all joined')
              )
            )
          ),
          React.createElement('div', {className: 'row' + (mode === 'edit' ? ' button-row' : '')},
            mode === 'edit' ?
              React.createElement('button', {type: 'button', className: 'delete', onClick: this.handleDelete}, 'Delete')
              : null,
            React.createElement('input', {type: 'submit', className: 'create' + (mode === 'new' ? ' full-width-margin' : ''), value: 'Save'})
          )
        )
      );
    },

    getOwnedParticipantComponents: function () {
      return Object.keys(this.refs)
        .filter(function (ref) {
          return ref.indexOf('participant') === 0;
        })
        .map(function (ref) {
          return this.refs[ref];
        }.bind(this));
    },

    getParticipantsValues: function () {
      return this.getOwnedParticipantComponents()
        .map(function (participantComponent) {
          return participantComponent.getValue();
        })
        .filter(function (value) {
          return !!value;
        });
    },

    getValues: function () {
      return {
        date: this.refs.date.getDOMNode().value,
        description: this.refs.description.getDOMNode().value,
        participants: this.getParticipantsValues()
      };
    },

    handleSubmit: function (event) {
      event.preventDefault();
      this.props.handleSubmit();
    },

    handleDelete: function (event) {
      this.props.handleDelete();
    },

    handleAddParticipant: function (event) {
      this.setState({newParticipantsCount: ++this.state.newParticipantsCount});
    },

    handleAllJoined: function () {
      this.getOwnedParticipantComponents().forEach(function (participantComponent) {
        participantComponent.setJoined();
      });
    }

  });

});
