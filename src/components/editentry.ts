import React, { PureComponent, ReactFragment } from 'react';
import iobject from '../lang/iobject';
import Loader from './loader';
import Form from './form';
import LoadError from './loaderror';
import { Transaction, Account, TransactionType } from '../types';

var el = React.createElement;

interface Props {
  mode: 'new' | 'edit';
  data?: Transaction;
  accounts: Account[];
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  onCloseClick: () => void;
  onCreate: (transaction: Partial<Transaction>) => void;
  onUpdate: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onChangeTabClick: () => void;
}

export default class EditEntry extends PureComponent<Props> {

  getValues() {
    return (this.refs.form as any).getValues();
  }

  handleSubmit(event: any) {
    event.preventDefault();

    var values = this.getValues();

    if (!this.validate(values)) {
      alert('Please fill in all fields and have at least two participants and one person who paid.');
      return;
    }

    var data: Partial<Transaction> = {
      description: values.description,
      transactionType: values.transactionType
    };

    if (values.transactionType === TransactionType.DIRECT) {
      data.participants = this.getParticantsFromDirect(values.direct);
    } else {
      data.participants = this.normalizeParticipants(values.participants);
    }

    data.date = new Date(values.date).toJSON();
    data.timestamp = new Date().toJSON();
    if (this.props.data) {
      this.props.onUpdate(iobject.merge(this.props.data, data) as Transaction);
    } else {
      this.props.onCreate(data);
    }
  }

  getParticantsFromDirect(direct: any): Account[] {
    return [
      {
        participant: direct.from,
        amount: direct.amount
      },
      {
        participant: direct.to,
        amount: -direct.amount
      }
    ];
  }

  normalizeParticipants(rawParticipants: any): Account[] {
    return (
      rawParticipants
      .filter(function (participant: any) {
        return participant.status > 0;
      })
      .map(function (participant: any) {
        return {
          participant: participant.participant,
          amount: participant.amount
        };
      })
    );
  }

  validate(data: any): boolean {
    if (!data.description) {
      return false;
    }

    if (!data.date) {
      return false;
    }

    if (data.transactionType === 'DIRECT') {
      return this.validateDirect(data.direct);
    } else {
      return this.validateShared(data.participants);
    }
  }

  validateDirect(data: any): boolean {
    return !!data.from && !!data.to && !!data.amount && data.from !== data.to;
  }

  validateShared(participants: any[]): boolean {
    var joinedParticipants = participants.filter(function (participant) {
      return participant.status > 0;
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
  }

  handleDelete() {
    if (this.props.data) {
      this.props.onDelete(this.props.data);
    } else {
      throw new Error();
    }
  }

  renderHeader(showSaveButton: boolean): ReactFragment {
    return (
      el('div', {className: 'header'},
        el('button', {className: 'left', onClick: this.props.onCloseClick},
          el('svg', {height: 16, width: 16},
            el('path', {d: 'm7.4983 0.5c0.8974 0 1.3404 1.0909 0.6973 1.7168l-4.7837 4.7832h11.573c1.3523-0.019125 1.3523 2.0191 0 2h-11.572l4.7832 4.7832c0.98163 0.94251-0.47155 2.3957-1.4141 1.4141l-6.4911-6.49c-0.387-0.3878-0.391-1.0228 0-1.414l6.4905-6.49c0.1883-0.1935 0.4468-0.30268 0.7168-0.3027z'})
          )
        ),
        el('h2', null, this.props.mode === 'new' ? 'New transaction' : 'Edit transaction'),
        (
          showSaveButton &&
          el('button', {className: 'right create', form: 'edit-entry-form'},
            el('svg', {height: 16, width: 16},
              el('path', {d: 'm13.631 3.9906a1.0001 1.0001 0 0 0-0.6875 0.30273l-6.5937 6.5938-3.293-3.293a1.0001 1.0001 0 1 0-1.4141 1.4141l4 4a1.0001 1.0001 0 0 0 1.4141 0l7.3008-7.3008a1.0001 1.0001 0 0 0-0.72656-1.7168z', fill: '#fff'})
            )
          )
        )
      )
    );
  }

  renderContent(): ReactFragment {
    if (this.props.remoteTabError) {
      return el(LoadError, {message: this.props.remoteTabError, onOkClick: this.props.onChangeTabClick});
    }

    if (this.props.mode === 'edit' && !this.props.data) {
      var message = 'Could not find transaction.';
      return el(LoadError, {message: message, onOkClick: this.props.onCloseClick});
    }

    return (
      el(Form, {
        mode: this.props.mode,
        data: this.props.data,
        accounts: this.props.accounts,
        onSubmit: this.handleSubmit,
        onDelete: this.handleDelete,
        ref: 'form'
      })
    );
  }

  render(): ReactFragment {
    var isLoading = this.props.checkingRemoteTab || this.props.importingTab;

    return (
      el('div', {className: 'scene editEntryScene'},
        this.renderHeader(!isLoading && !(this.props.remoteTabError || (this.props.mode === 'edit' && !this.props.data))),
        el(Loader, {show: isLoading},
          this.renderContent()
        )
      )
    );
  }

}
