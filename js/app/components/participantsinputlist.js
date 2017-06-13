define([
  'react',
  'create-react-class',
  './participantinput',
  './newparticipantinput'
],

function (React, createReactClass, ParticipantInput, NewParticipantInput) {
  'use strict';

  var el = React.createElement;
  var PropTypes = React.PropTypes;

  return createReactClass({

    displayName: 'ParticipantsInputList',

    propTypes: {
      mode: PropTypes.string.isRequired,
      tabParticipants: PropTypes.arrayOf(PropTypes.string).isRequired,
      participants: PropTypes.arrayOf(PropTypes.object).isRequired,
      newParticipantsIds: PropTypes.arrayOf(PropTypes.string).isRequired
    },

    focusLastInput: function () {
      var newParticipantsIds = this.props.newParticipantsIds;
      var lastNewParticipantId = newParticipantsIds[newParticipantsIds.length - 1];
      var lastInput = this.refs['participant-' + lastNewParticipantId];
      lastInput.focusParticipantInput();
    },

    setAllJoined: function () {
      this.getOwnedParticipantComponents().forEach(function (participantComponent) {
        participantComponent.setJoined();
      });
    },

    findParticipantDefaultValue: function (participant) {
      var value = null;
      this.props.participants.forEach(function (participantValue) {
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

    getValues: function () {
      var participants = this.getOwnedParticipantComponents().map(function (participantComponent) {
        return participantComponent.getValue();
      });

      var nonEmptyParticipants = participants.filter(function (value) {
        return value.participant || value.status;
      });

      return nonEmptyParticipants;
    },

    renderParticipantInputs: function (participants, mode) {
      var participantPropsList = participants.map(function (participant, idx) {
        var props = {
          participant: participant,
          key: participant,
          ref: 'participant' + idx
        };
        if (mode === 'edit') {
          props.value = this.findParticipantDefaultValue(participant);
        }
        if (mode === 'new' && participants.length === 2) {
          props.value = {amount: 0};
        }
        return props;
      }.bind(this));

      // sort participants by 1) amount paid 2) joined 3) alphabetical
      participantPropsList.sort(function (a, b) {
        var sortableValue = function (value) {
          return value ? value.amount : -1;
        };
        var sortableValueA = sortableValue(a.value);
        var sortableValueB = sortableValue(b.value);
        if (sortableValueA === sortableValueB) {
          return a.participant < b.participant ? -1 : 1;
        }
        return sortableValueA > sortableValueB ? -1 : 1;
      });

      return participantPropsList.map(function (props) {
        return el(ParticipantInput, props);
      });
    },

    renderNewParticipantInputs: function (newParticipantsIds) {
      return newParticipantsIds.map(function (newParticipantId) {
        return el(NewParticipantInput, {
          key: newParticipantId,
          ref: 'participant-' + newParticipantId
        });
      });
    },

    render: function () {
      return (
        el('div', {className: 'form-row'},
          el('div', {className: 'form-row-input'},
            this.renderParticipantInputs(this.props.tabParticipants, this.props.mode),
            this.renderNewParticipantInputs(this.props.newParticipantsIds)
          )
        )
      );
    }
  });

});
