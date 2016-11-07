define([
  'react',
  './participantinput',
  './newparticipantinput'
],

function (React, ParticipantInput, NewParticipantInput) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return React.createClass({

    displayName: 'Form',

    propTypes: {
      mode: PropTypes.oneOf(['new', 'edit']).isRequired,
      data: PropTypes.object,
      participants: PropTypes.arrayOf(PropTypes.string).isRequired,
      handleCloseClick: PropTypes.func.isRequired,
      handleDelete: PropTypes.func.isRequired
    },

    getInitialState: function () {
      var newParticipantsIds = [];
      if (this.props.participants.length < 2) {
        newParticipantsIds.push(this.createUniqueId());
        newParticipantsIds.push(this.createUniqueId());
      }
      return {
        newParticipantsIds: newParticipantsIds
      };
    },

    createUniqueId: function () {
      return '' + Math.round(Math.random() * 100000000);
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
      var participants = this.getOwnedParticipantComponents().map(function (participantComponent) {
        return participantComponent.getValue();
      });

      var nonEmptyParticipants = participants.filter(function (value) {
        return value.participant || value.status;
      });

      return nonEmptyParticipants;
    },

    getValues: function () {
      return {
        date: this.refs.date.value,
        description: this.refs.description.value,
        participants: this.getParticipantsValues()
      };
    },

    handleAddParticipant: function () {
      var newParticipantsIds = this.state.newParticipantsIds.concat(this.createUniqueId());
      this.setState({
        newParticipantsIds: newParticipantsIds
      }, function () {
        var newParticipantsIds = this.state.newParticipantsIds;
        var lastNewParticipantId = newParticipantsIds[newParticipantsIds.length - 1];
        var lastInput = this.refs['participant-' + lastNewParticipantId];
        lastInput.focusParticipantInput();
      }.bind(this));
    },

    handleAllJoined: function () {
      this.getOwnedParticipantComponents().forEach(function (participantComponent) {
        participantComponent.setJoined();
      });
    },

    render: function () {
      var mode = this.props.mode;

      var participantPropsList = this.props.participants.map(function (participant, idx) {
        var props = {
          participant: participant,
          key: participant,
          ref: 'participant' + idx
        };
        if (mode === 'edit') {
          props.value = this.findParticipantDefaultValue(participant);
        }
        if (mode === 'new' && this.props.participants.length === 2) {
          props.value = {amount: 0};
        }
        return props;
      }.bind(this));
      participantPropsList.sort(function (a, b) {
        var sortableValue = function (value) {
          return value ? value.amount : 0;
        };
        return sortableValue(a.value) > sortableValue(b.value) ? -1 : 1;
      });
      var participantInputs = participantPropsList.map(function (props) {
        return el(ParticipantInput, props);
      });

      var newParticipantInputs = this.state.newParticipantsIds.map(function (newParticipantId) {
        return el(NewParticipantInput, {
          key: newParticipantId,
          ref: 'participant-' + newParticipantId
        });
      });

      return (
        el('form', {onSubmit: this.handleSubmit},
          el('div', {className: 'form'},
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('input', {
                  type: 'text',
                  placeholder: 'Description',
                  defaultValue: mode === 'edit' ? this.props.data.description : '',
                  ref: 'description'
                })
              )
            ),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('input', {
                  type: 'date',
                  defaultValue: this.formatDate(mode === 'edit' ? new Date(this.props.data.date) : new Date()),
                  ref: 'date'
                })
              )
            ),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                participantInputs,
                newParticipantInputs
              )
            ),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('button', {type: 'button', onClick: this.handleAddParticipant}, '+ new participant'),
                el('button', {type: 'button', className: 'all-joined', onClick: this.handleAllJoined}, '✓ all joined')
              )
            )
          ),
          el('div', {className: 'row' + (mode === 'edit' ? ' button-row' : '')},
            mode === 'edit' ?
              el('button', {type: 'button', className: 'delete full-width-margin', onClick: this.props.handleDelete}, 'Delete')
              : null
          )
        )
      );
    }
  });

});
