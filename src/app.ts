import { connect } from 'react-redux';
import selectors from './redux/selectors';
import { navigateToTabs, selectTab, navigateToAddTransaction, navigateToUpdateTransaction, setError, createTab, importTab, closeTransaction, addOrUpdateTransaction, removeTransaction, initTransactionForm, resetTransactionForm, updateTransactionForm, updateTransactionSharedForm, updateTransactionDirectForm, updateTransactionParticipant, addParticipantToTransactionSharedForm, setAllJoinedOnTransactionSharedForm } from './redux/actioncreators';
import App from './components/app';
import { AllState } from "./";
import { Transaction } from "./types";

function mapStateToProps (state: AllState) {
  return {
    location: state.location,
    initialLoadingDone: state.app.initialLoadingDone,
    tabInfo: selectors.getTabInfo(state),
    transaction: state.app.docsById[state.location.payload.transactionId] as Transaction,
    total: selectors.getTotal(state),
    checkingRemoteTab: state.app.checkingRemoteTab,
    remoteTabError: state.app.remoteTabError,
    importingTab: state.app.importingTab,
    tabs: selectors.getTabs(state),
    transactions: selectors.getTransactions(state),
    accounts: selectors.getAccounts(state),
    transactionFormState: state.app.transactionForm,
    error: state.app.error
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
  onAddOrUpdateTransaction: addOrUpdateTransaction,
  onRemoveTransaction: removeTransaction,
  onInitTransactionForm: initTransactionForm,
  onResetTransactionForm: resetTransactionForm,
  onUpdateTransactionForm: updateTransactionForm,
  onUpdateTransactionSharedForm: updateTransactionSharedForm,
  onUpdateTransactionDirectForm: updateTransactionDirectForm,
  onUpdateTransactionParticipant: updateTransactionParticipant,
  onAddParticipant: addParticipantToTransactionSharedForm,
  onSetAllJoined: setAllJoinedOnTransactionSharedForm,
  onError: setError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
