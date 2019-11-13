import React, { Component } from 'react';
import { Account, Transaction, Tab } from '../types';
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
  tabName?: string;
  transaction?: Transaction;
  tabs: Tab[];
  checkingRemoteTab?: boolean;
  remoteTabError?: string;
  importingTab?: boolean;
  transactions: Transaction[];
  accounts: Account[];
  total: number;
  error?: any;
  onNavigateToTabs: () => void;
  onCreateTab: (name: string) => void;
  onImportTab: (id: string) => void;
  onSelectTab: (id: string) => void;
  onNavigateToAddTransaction: (tabId: string) => void;
  onNavigateToUpdateTransaction: (tabId: string, transactionId: string) => void;
  onCloseTransaction: () => void;
  onAddTransaction: (transaction: Transaction) => void;
  onUpdateTransaction: (transaction: Transaction) => void;
  onRemoveTransaction: (doc: any) => void;
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
    var tabName = this.props.tabName;

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
      el('div', {id: 'scenes'},
        el(Tabs, {
          data: this.props.tabs,
          visible: this.props.location.type === 'ROUTE_TABS',
          checkingRemoteTab: this.props.checkingRemoteTab,
          remoteTabError: this.props.remoteTabError,
          onTabClick: this.props.onSelectTab,
          onCreateNewTab: this.props.onCreateTab,
          onImportTab: this.props.onImportTab
        }),
        el(Main, {
          tabName: this.props.tabName,
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
            data: this.props.transaction,
            accounts: this.props.accounts,
            checkingRemoteTab: this.props.checkingRemoteTab,
            remoteTabError: this.props.remoteTabError,
            importingTab: this.props.importingTab,
            onChangeTabClick: this.props.onNavigateToTabs,
            onCloseClick: this.props.onCloseTransaction,
            onCreate: this.props.onAddTransaction,
            onUpdate: this.props.onUpdateTransaction,
            onDelete: this.props.onRemoveTransaction
          })
      )
    );
  }

}
