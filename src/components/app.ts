import React, { Component } from 'react';
import { Account, Transaction, Tab, Info, TransactionFormState, TransactionFormSharedState } from '../types';
import Tabs from './tabs';
import Main from './main';
import EditEntry from './editentry';
import ErrorView from './error';

var el = React.createElement;

var titleBase = 'Grouptabs';

function setTitle (input?: string) {
  var documentTitle = document.title;
  var result = input ? input + ' – ' + titleBase : titleBase;

  if (result !== documentTitle) {
    document.title = result;
  }
}

interface Props {
  location: {
    type: string,
    payload: any,
  };
  initialLoadingDone?: boolean;
  tabInfo?: Info;
  transaction?: Transaction;
  tabs: Tab[];
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  createTabInputValue?: string;
  importTabInputValue?: string;
  transactions: Transaction[];
  accounts: Account[];
  total: number;
  error?: any;
  tabDataMissing?: boolean;
  transactionFormState?: TransactionFormState;
  onNavigateToTabs: () => void;
  onCreateTabInputChange: (value: string) => void;
  onCreateTab: (name: string) => void;
  onImportTabInputChange: (value: string) => void;
  onImportTab: (id: string) => void;
  onSelectTab: (id: string) => void;
  onNavigateToAddTransaction: (tabId: string) => void;
  onNavigateToUpdateTransaction: (tabId: string, transactionId: string) => void;
  onCloseTransaction: () => void;
  onAddOrUpdateTransaction: () => void;
  onRemoveTransaction: () => void;
  onInitTransactionForm: () => void;
  onResetTransactionForm: () => void;
  onUpdateTransactionForm: <K extends keyof TransactionFormState>(key: K, value: TransactionFormState[K]) => void;
  onUpdateTransactionSharedForm: <K extends keyof TransactionFormState['shared']>(key: K, value: TransactionFormState['shared'][K]) => void;
  onUpdateTransactionDirectForm: <K extends keyof TransactionFormState['direct']>(key: K, value: TransactionFormState['direct'][K]) => void;
  onUpdateTransactionParticipant: <K extends 'participant' | 'status' | 'amount'>(id: string, key: K, value: TransactionFormSharedState[K]) => void;
  onAddParticipant: () => void;
  onSetAllJoined: () => void;
  onError: (error: any, info: any) => void;
}

export default class App extends Component<Props> {

  componentDidCatch(error: any, info: any) {
    this.props.onError(error, info);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.location.type !== this.props.location.type) {
      window.scrollTo({top: 0});
    }

    this.setPageTitle();
  }

  setPageTitle() {
    var tabName = this.props.tabInfo?.name || '';

    switch (this.props.location.type) {
      case 'ROUTE_TAB':
        setTitle(tabName);
        break;
      case 'ROUTE_NEW_TRANSACTION':
        setTitle(tabName ? 'New transaction (' + tabName + ')' : '');
        break;
      case 'ROUTE_TRANSACTION':
        var transaction = this.props.transaction;
        setTitle(transaction ? transaction.description + ' (' + tabName + ')' : '');
        break;
      default:
        setTitle();
    }
  }

  render() {
    if (this.props.error) {
      return (
        el('div', {id: 'scenes'},
          el(ErrorView, {error: this.props.error})
        )
      );
    }

    return (
      el(React.StrictMode, null,
        el('div', {id: 'scenes'},
          el(Tabs, {
            data: this.props.tabs,
            visible: this.props.location.type === 'ROUTE_TABS',
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            createTabInputValue: this.props.createTabInputValue,
            importTabInputValue: this.props.importTabInputValue,
            onTabClick: this.props.onSelectTab,
            onCreateTabInputChange: this.props.onCreateTabInputChange,
            onCreateNewTab: this.props.onCreateTab,
            onImportTabInputChange: this.props.onImportTabInputChange,
            onImportTab: this.props.onImportTab
          }),
          el(Main, {
            tabInfo: this.props.tabInfo,
            tabId: this.props.location.payload.tabId,
            accounts: this.props.accounts,
            transactions: this.props.transactions,
            total: this.props.total,
            visible: this.props.location.type === 'ROUTE_TAB',
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            importingTab: this.props.importingTab,
            onChangeTabClick: this.props.onNavigateToTabs,
            onNavigateToAddTransaction: this.props.onNavigateToAddTransaction,
            onDetailsClick: this.props.onNavigateToUpdateTransaction
          }),
          (
            !!this.props.initialLoadingDone
            && (
              this.props.location.type === 'ROUTE_NEW_TRANSACTION'
              || this.props.location.type === 'ROUTE_TRANSACTION'
            )
          ) &&
            el(EditEntry, {
              mode: this.props.location.type === 'ROUTE_NEW_TRANSACTION' ? 'new' : 'edit',
              formState: this.props.transactionFormState,
              checkingRemoteTab: this.props.checkingRemoteTab,
              remoteTabError: this.props.remoteTabError,
              importingTab: this.props.importingTab,
              onChangeTabClick: this.props.onNavigateToTabs,
              onCloseClick: this.props.onCloseTransaction,
              onSave: this.props.onAddOrUpdateTransaction,
              onDelete: this.props.onRemoveTransaction,
              onInitForm: this.props.onInitTransactionForm,
              onUpdateForm: this.props.onUpdateTransactionForm,
              onUpdateSharedForm: this.props.onUpdateTransactionSharedForm,
              onUpdateDirectForm: this.props.onUpdateTransactionDirectForm,
              onUpdateParticipant: this.props.onUpdateTransactionParticipant,
              onAddParticipant: this.props.onAddParticipant,
              onSetAllJoined: this.props.onSetAllJoined,
            })
        )
      )
    );
  }

}
