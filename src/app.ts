import { connect } from 'react-redux';
import selectors from './redux/selectors';
import { navigateToTabs, selectTab, navigateToAddTransaction, navigateToUpdateTransaction, setError, createTab, importTab, closeTransaction, addTransaction, updateTransaction, removeTransaction } from './redux/actioncreators';
import App from './components/app';
import { AllState } from "./";
import { Transaction } from "./types";

function mapStateToProps (state: AllState) {
  const currentTabId = selectors.getCurrentTabId(state);
  return {
    location: state.location,
    initialLoadingDone: state.app.initialLoadingDone,
    tabName: selectors.getTabName(state),
    transaction: state.app.docsById[state.location.payload.transactionId] as Transaction,
    total: selectors.getTotal(state),
    checkingRemoteTab: state.app.checkingRemoteTab,
    remoteTabError: state.app.remoteTabError,
    importingTab: state.app.importingTab,
    tabs: selectors.getTabs(state),
    transactions: selectors.getTransactions(state),
    accounts: selectors.getAccounts(state),
    error: state.app.error,
    tabDataMissing: currentTabId && !state.app.docsById['info-' + currentTabId] ? true : false,
  };
}

var mapDispatchToProps = {
  onNavigateToTabs: navigateToTabs,
  onCreateTab: createTab,
  onImportTab: importTab,
  onSelectTab: selectTab,
  onNavigateToAddTransaction: navigateToAddTransaction,
  onNavigateToUpdateTransaction: navigateToUpdateTransaction,
  onCloseTransaction: closeTransaction,
  onAddTransaction: addTransaction,
  onUpdateTransaction: updateTransaction,
  onRemoveTransaction: removeTransaction,
  onError: setError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
