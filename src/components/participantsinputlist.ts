import React, { PureComponent } from 'react';
import ParticipantInput from './participantinput';
import NewParticipantInput from './newparticipantinput';
import { Account } from '../types';

var el = React.createElement;

interface Props {
  mode: 'new' | 'edit';
  tabParticipants: string[];
  participants: Account[];
  newParticipantsIds: string[];
}

export default class ParticipantsInputList extends PureComponent<Props> {

  focusLastInput() {
    var newParticipantsIds = this.props.newParticipantsIds;
    var lastNewParticipantId = newParticipantsIds[newParticipantsIds.length - 1];
    var lastInput = this.refs['participant-' + lastNewParticipantId];
    (lastInput as NewParticipantInput).focusParticipantInput();
  }

  setAllJoined() {
    this.getOwnedParticipantComponents().forEach(function (participantComponent) {
      participantComponent.setJoined();
    });
  }

  findParticipantDefaultValue(participant: string) {
    var value = null;
    this.props.participants.forEach(function (participantValue) {
      if (participantValue.participant === participant) {
        value = participantValue;
      }
    });
    return value;
  }

  getOwnedParticipantComponents() {
    return Object.keys(this.refs)
      .filter(function (ref) {
        return ref.indexOf('participant') === 0;
      })
      .map((ref) => {
        return this.refs[ref] as ParticipantInput | NewParticipantInput;
      });
  }

  getValues() {
    var participants = this.getOwnedParticipantComponents().map(function (participantComponent) {
      return participantComponent.getValue();
    });

    var nonEmptyParticipants = participants.filter(function (value) {
      return value.participant || value.status;
    });

    return nonEmptyParticipants;
  }

  renderParticipantInputs(participants: string[], mode: Props['mode']) {
    var participantPropsList = participants.map((participant, idx) => {
      var props: any = {
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
    });

    // sort participants by 1) amount paid 2) joined 3) alphabetical
    participantPropsList.sort(function (a, b) {
      var sortableValue = function (value: any) {
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
  }

  renderNewParticipantInputs(newParticipantsIds: string[]) {
    return newParticipantsIds.map(function (newParticipantId) {
      return el(NewParticipantInput, {
        key: newParticipantId,
        ref: 'participant-' + newParticipantId
      });
    });
  }

  render() {
    return (
      el('div', {className: 'form-row'},
        el('div', {className: 'form-row-input'},
          this.renderParticipantInputs(this.props.tabParticipants, this.props.mode),
          this.renderNewParticipantInputs(this.props.newParticipantsIds)
        )
      )
    );
  }
}
