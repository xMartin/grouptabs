import React, { PureComponent, SyntheticEvent } from 'react';
import DateInput from './dateinput';
import DirectTransactionInput from './directtransactioninput';
import ParticipantsInputList from './participantsinputlist';
import { TransactionType, TransactionFormState } from '../types';
import { control } from '../util/form';
import { PropsFromRedux } from '../app';
import { validate } from '../util/transactionform';

var el = React.createElement;

interface Props {
  mode: 'new' | 'edit';
  data: TransactionFormState;
  onUpdateForm: PropsFromRedux['onUpdateTransactionForm'];
  onUpdateSharedForm: PropsFromRedux['onUpdateTransactionSharedForm'];
  onUpdateDirectForm: PropsFromRedux['onUpdateTransactionDirectForm'];
  onUpdateParticipant: PropsFromRedux['onUpdateTransactionParticipant'];
  onAddParticipant: () => void;
  onSetAllJoined: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default class Form extends PureComponent<Props> {

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate(this.props.data)) {
      alert('Please fill in all fields and have at least two participants and one person who paid.');
      return;
    }

    this.props.onSave();
  }

  handleDelete = () => {
    if (confirm('Do you really want to delete the transaction?')) {  // eslint-disable-line no-restricted-globals
      this.props.onDelete();
    }
  }

  handleSelectTransactionType = (event: SyntheticEvent<HTMLInputElement>) => {
    var transactionType = event.currentTarget.value;
    this.props.onUpdateForm('transactionType', TransactionType[transactionType as keyof typeof TransactionType]);
  }

  handleDateChange = (date: string) => {
    this.props.onUpdateForm('date', date);
  }

  render() {
    const { mode, data, onUpdateForm, onUpdateDirectForm } = this.props;

    return (
      el('form', {id: 'edit-entry-form', onSubmit: this.handleSubmit},
        el('div', {className: 'form'},
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input description'},
              el('input', {
                type: 'text',
                placeholder: 'Description',
                value: control(data.description),
                onChange: (event: SyntheticEvent<HTMLInputElement>) => onUpdateForm('description', event.currentTarget.value),
                autoFocus: mode === 'new' ? true : undefined
              })
            ),
            el('div', {className: 'form-row-input transaction-type'},
              el('select', {onChange: this.handleSelectTransactionType, value: data.transactionType},
                el('option', {value: TransactionType.SHARED}, 'Shared'),
                el('option', {value: TransactionType.DIRECT}, 'Direct')
              )
            )
          ),
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input'},
              el(DateInput, {
                date: data.date,
                onChange: this.handleDateChange
              })
            )
          ),
          el('div', {
            style: {display: data.transactionType === TransactionType.SHARED ? 'none' : ''},
            className: 'form-row'
          },
            el(DirectTransactionInput, {
              data: data.direct,
              onChange: onUpdateDirectForm
            })
          ),
          el('div', {
            style: {display: data.transactionType === TransactionType.DIRECT ? 'none' : ''}
          },
            el(ParticipantsInputList, {
              inputs: data.shared,
              onChangeParticipant: this.props.onUpdateParticipant,
            }),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('button', {type: 'button', onClick: this.props.onAddParticipant}, '+ new participant'),
                el('button', {type: 'button', className: 'all-joined', onClick: this.props.onSetAllJoined}, 'all joined')
              )
            )
          )
        ),
        el('div', {className: 'row' + (mode === 'edit' ? ' button-row' : '')},
          mode === 'edit' ?
            el('span', {className: 'fake-link delete', onClick: this.handleDelete}, 'Delete transaction')
            : null
        )
      )
    );
  }

}
