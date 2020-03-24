import React, { PureComponent, SyntheticEvent, ReactFragment } from 'react';
import transactionUtils from '../util/transaction';
import DateInput from './dateinput';
import DirectTransactionInput from './directtransactioninput';
import ParticipantsInputList from './participantsinputlist';
import { Transaction, Account, TransactionType } from '../types';

var el = React.createElement;

interface Props {
  mode: 'new' | 'edit';
  data?: Transaction;
  accounts: Account[];
  onSubmit: (transaction: Transaction) => void;
  onDelete: () => void;
}

interface State {
  transactionType: TransactionType;
  newParticipantsIds: string[];
}

export default class Form extends PureComponent<Props, State> {

  constructor(props: Props) {
    super(props);
    var newParticipantsIds = [];
    if (this.props.accounts.length < 2) {
      newParticipantsIds.push(this.createUniqueId());
      newParticipantsIds.push(this.createUniqueId());
    }
    this.state = {
      transactionType: this.props.mode === 'edit' && this.props.data ? transactionUtils.getTransactionType(this.props.data) : TransactionType.SHARED,
      newParticipantsIds: newParticipantsIds
    };
  }

  componentDidMount() {
    if (this.props.mode === 'new') {
      this.refs.description && (this.refs.description as HTMLInputElement).focus();
    }
  }

  createUniqueId() {
    return '' + Math.round(Math.random() * 100000000);
  }

  getValues() {
    return {
      date: (this.refs.dateInput as any).getValue(),
      description: (this.refs.description as HTMLInputElement).value,
      transactionType: this.state.transactionType,
      participants: (this.refs.participantsInputList as any).getValues(),
      direct: (this.refs.directTransactionInput as any).getValues()
    };
  }

  handleAddParticipant() {
    this.setState({
      newParticipantsIds: this.state.newParticipantsIds.concat(this.createUniqueId())
    }, () => {
      (this.refs.participantsInputList as any).focusLastInput();
    });
  }

  handleAllJoined() {
    (this.refs.participantsInputList as any).setAllJoined();
  }

  handleDelete() {
    if (confirm('Do you really want to delete the transaction?')) {  // eslint-disable-line no-restricted-globals
      this.props.onDelete();
    }
  }

  handleSelectTransactionType(event: SyntheticEvent<HTMLInputElement>) {
    var transactionType = event.currentTarget.value;
    this.setState({
      transactionType: TransactionType[transactionType as keyof typeof TransactionType]
    });
  }

  render(): ReactFragment {
    var mode = this.props.mode;

    return (
      el('form', {id: 'edit-entry-form', onSubmit: this.props.onSubmit},
        el('div', {className: 'form'},
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input description'},
              el('input', {
                type: 'text',
                placeholder: 'Description',
                defaultValue: mode === 'edit' && this.props.data ? this.props.data.description : '',
                ref: 'description'
              })
            ),
            el('div', {className: 'form-row-input transaction-type'},
              el('select', {onChange: this.handleSelectTransactionType, defaultValue: this.state.transactionType},
                el('option', {value: TransactionType.SHARED}, 'Shared'),
                el('option', {value: TransactionType.DIRECT}, 'Direct')
              )
            )
          ),
          el('div', {className: 'form-row'},
            el('div', {className: 'form-row-input'},
              el(DateInput, {
                ref: 'dateInput',
                date: this.props.data && this.props.data.date
              })
            )
          ),
          el('div', {
            style: {display: this.state.transactionType === TransactionType.SHARED ? 'none' : ''},
            className: 'form-row'
          },
            el(DirectTransactionInput, {
              ref: 'directTransactionInput',
              accounts: this.props.accounts,
              participants: mode === 'edit' && this.props.data ? this.props.data.participants : []
            })
          ),
          el('div', {
            style: {display: this.state.transactionType === TransactionType.DIRECT ? 'none' : ''}
          },
            el(ParticipantsInputList, {
              ref: 'participantsInputList',
              mode: mode,
              tabParticipants: this.props.accounts.map(function (account) {
                return account.participant;
              }),
              participants: mode === 'edit' && this.props.data ? this.props.data.participants : [],
              newParticipantsIds: this.state.newParticipantsIds
            }),
            el('div', {className: 'form-row'},
              el('div', {className: 'form-row-input'},
                el('button', {type: 'button', onClick: this.handleAddParticipant}, '+ new participant'),
                el('button', {type: 'button', className: 'all-joined', onClick: this.handleAllJoined}, 'all joined')
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
