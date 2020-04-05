import React, { PureComponent, ReactFragment } from 'react';
import Loader from './loader';
import Form from './form';
import LoadError from './loaderror';
import { TransactionFormState } from '../types';
import { PropsFromRedux } from '../app';

var el = React.createElement;

interface Props {
  mode: 'new' | 'edit';
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  formState?: TransactionFormState;
  onInitForm: () => void;
  onUpdateForm: PropsFromRedux['onUpdateTransactionForm'];
  onUpdateSharedForm: PropsFromRedux['onUpdateTransactionSharedForm'];
  onUpdateDirectForm: PropsFromRedux['onUpdateTransactionDirectForm'];
  onUpdateParticipant: PropsFromRedux['onUpdateTransactionParticipant'];
  onAddParticipant: () => void;
  onSetAllJoined: () => void;
  onCloseClick: () => void;
  onChangeTabClick: () => void;
  onSave: () => void;
  onDelete: () => void;
}

export default class EditEntry extends PureComponent<Props> {

  componentDidMount() {
    this.props.onInitForm();
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

  renderContent() {
    if (this.props.remoteTabError) {
      return el(LoadError, {message: this.props.remoteTabError, onOkClick: this.props.onChangeTabClick});
    }

    if (this.props.mode === 'edit' && !this.props.formState) {
      var message = 'Could not find transaction.';
      return el(LoadError, {message: message, onOkClick: this.props.onCloseClick});
    }

    if (!this.props.formState) {
      return null;
    }

    return (
      el(Form, {
        mode: this.props.mode,
        data: this.props.formState,
        onUpdateForm: this.props.onUpdateForm,
        onUpdateSharedForm: this.props.onUpdateSharedForm,
        onUpdateDirectForm: this.props.onUpdateDirectForm,
        onUpdateParticipant: this.props.onUpdateParticipant,
        onAddParticipant: this.props.onAddParticipant,
        onSetAllJoined: this.props.onSetAllJoined,
        onSave: this.props.onSave,
        onDelete: this.props.onDelete,
      })
    );
  }

  render() {
    var isLoading = this.props.checkingRemoteTab || this.props.importingTab;

    return (
      el('div', {className: 'scene editEntryScene'},
        this.renderHeader(!isLoading && !(this.props.remoteTabError || (this.props.mode === 'edit' && !this.props.formState))),
        el(Loader, {show: isLoading},
          this.renderContent()
        )
      )
    );
  }

}
