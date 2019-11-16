import { connect } from 'react-redux';
import selectors from './redux/selectors';
import actionCreators from './redux/actioncreators';
import App from './components/app';
import { AllState } from "./";
import { Transaction } from "./types";

function mapStateToProps (state: AllState) {
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
    error: state.app.error
  };
}

var mapDispatchToProps = {
  onNavigateToTabs: actionCreators.navigateToTabs,
  onCreateTab: actionCreators.createTab,
  onImportTab: actionCreators.importTab,
  onSelectTab: actionCreators.selectTab,
  onNavigateToAddTransaction: actionCreators.navigateToAddTransaction,
  onNavigateToUpdateTransaction: actionCreators.navigateToUpdateTransaction,
  onCloseTransaction: actionCreators.closeTransaction,
  onAddTransaction: actionCreators.addTransaction,
  onUpdateTransaction: actionCreators.updateTransaction,
  onRemoveTransaction: actionCreators.removeTransaction,
  onError: actionCreators.setError
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
