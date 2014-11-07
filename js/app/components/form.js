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
        newParticipantsCount: this.props.accounts.length < 2 ? 2 : 0
      };
    },

    componentWillReceiveProps: function (newProps) {
      this.setState({newParticipantsCount: newProps.accounts.length < 2 ? 2 : 0});
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
      var participantInputs = this.props.accounts.map(function (participant, idx) {
        var props = {
          participant: participant,
          ref: 'participant' + idx
        };
        if (this.props.mode === 'edit') {
          props.value = this.findParticipantDefaultValue(participant)
        }
        return ParticipantInput(props);
      }.bind(this));
      var newParticipantInputs = (function () {
        var result = [];
        for (var i = 0; i < this.state.newParticipantsCount; ++i) {
          result.push(NewParticipantInput({ref: 'participant' + participantInputs.length + i}));
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
                  defaultValue: this.props.mode === 'edit' ? this.props.data.description : '',
                  ref: 'description'
                })
              ),
              React.createElement('div', {className: 'form-row-input'},
                React.createElement('input', {
                  type: 'date',
                  defaultValue: this.formatDate(this.props.mode === 'edit' ? new Date(this.props.data.date) : new Date()),
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
                React.createElement('button', {onClick: this.handleAddParticipant}, '+ new participant'),
                React.createElement('button', {onClick: this.handleAllJoined}, '✓ all joined')
              )
            )
          ),
          React.createElement('div', {className: 'row'},
            React.createElement('button', {className: 'delete', onClick: this.props.handleDelete}, 'Delete'),
            React.createElement('input', {type: 'submit', className: 'create full-width-margin', value: 'Save'})
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

    handleAddParticipant: function (event) {
      event.preventDefault();
      this.setState({newParticipantsCount: ++this.state.newParticipantsCount})
    },

    handleAllJoined: function () {
      event.preventDefault();
      this.getOwnedParticipantComponents().forEach(function (participantComponent) {
        participantComponent.setJoined();
      });
    }

  });

});
