define([
  'react-redux',
  './redux/selectors',
  './redux/actioncreators',
  './components/app'
],

function (ReactRedux, selectors, actionCreators, App) {
  'use strict';

  function mapStateToProps (state) {
    return {
      location: state.location,
      initialLoadingDone: state.app.initialLoadingDone,
      tabName: selectors.getTabName(state),
      transaction: state.app.docsById[state.location.payload.transactionId],
      total: selectors.getTotal(state),
      checkingRemoteTab: state.app.checkingRemoteTab,
      remoteTabError: state.app.remoteTabError,
      importingTab: state.app.importingTab,
      tabs: selectors.getTabs(state),
      transactions: selectors.getTransactions(state),
      accounts: selectors.getAccounts(state),
      participants: selectors.getParticipants(state),
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

  return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);

});
