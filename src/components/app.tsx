import React, { Component } from 'react';
import Tabs from './tabs';
import Main from './main';
import EditEntry from './editentry';
import ErrorView from './error';
import { PropsFromRedux } from '../app';

var titleBase = 'Grouptabs';

function setTitle (input?: string) {
  var documentTitle = document.title;
  var result = input ? input + ' – ' + titleBase : titleBase;

  if (result !== documentTitle) {
    document.title = result;
  }
}

interface Props extends PropsFromRedux {}

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
        <div id='scenes'>
          <ErrorView error={this.props.error} />
        </div>
      );
    }

    return (
      <React.StrictMode>
        <div id='scenes'>
          <Tabs
            data={this.props.tabs}
            visible={this.props.location.type === 'ROUTE_TABS'}
            checkingRemoteTab={this.props.checkingRemoteTab}
            remoteTabError={this.props.remoteTabError}
            createTabInputValue={this.props.createTabInputValue}
            importTabInputValue={this.props.importTabInputValue}
            onTabClick={this.props.onSelectTab}
            onCreateTabInputChange={this.props.onCreateTabInputChange}
            onCreateNewTab={this.props.onCreateTab}
            onImportTabInputChange={this.props.onImportTabInputChange}
            onImportTab={this.props.onImportTab}
          />
          <Main
            tabInfo={this.props.tabInfo}
            tabId={this.props.location.payload.tabId}
            accounts={this.props.accounts}
            transactions={this.props.transactions}
            total={this.props.total}
            visible={this.props.location.type === 'ROUTE_TAB'}
            checkingRemoteTab={this.props.checkingRemoteTab}
            remoteTabError={this.props.remoteTabError}
            importingTab={this.props.importingTab}
            onChangeTabClick={this.props.onNavigateToTabs}
            onNavigateToAddTransaction={this.props.onNavigateToAddTransaction}
            onDetailsClick={this.props.onNavigateToUpdateTransaction}
          />
          {(
            !!this.props.initialLoadingDone
            && (
              this.props.location.type === 'ROUTE_NEW_TRANSACTION'
              || this.props.location.type === 'ROUTE_TRANSACTION'
            )
          ) &&
            <EditEntry
              mode={this.props.location.type === 'ROUTE_NEW_TRANSACTION' ? 'new' : 'edit'}
              formState={this.props.transactionFormState}
              checkingRemoteTab={this.props.checkingRemoteTab}
              remoteTabError={this.props.remoteTabError}
              importingTab={this.props.importingTab}
              onChangeTabClick={this.props.onNavigateToTabs}
              onCloseClick={this.props.onCloseTransaction}
              onSave={this.props.onAddOrUpdateTransaction}
              onDelete={this.props.onRemoveTransaction}
              onInitForm={this.props.onInitTransactionForm}
              onUpdateForm={this.props.onUpdateTransactionForm}
              onUpdateSharedForm={this.props.onUpdateTransactionSharedForm}
              onUpdateDirectForm={this.props.onUpdateTransactionDirectForm}
              onUpdateParticipant={this.props.onUpdateTransactionParticipant}
              onAddParticipant={this.props.onAddParticipant}
              onSetAllJoined={this.props.onSetAllJoined}
            />
          }
        </div>
      </React.StrictMode>
    );
  }

}
