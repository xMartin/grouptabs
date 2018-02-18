define([
  'react-redux',
  './redux/selector',
  './redux/actioncreators',
  './components/app'
],

function (ReactRedux, selector, actionCreators, App) {
  'use strict';

  function mapStateToProps (state) {
    var selected = selector(state);

    return {
      location: state.location,
      initialLoadingDone: state.app.initialLoadingDone,
      tabName: selected.tabName,
      transaction: state.app.docsById[state.location.payload.transactionId],
      checkingRemoteTab: state.app.checkingRemoteTab,
      remoteTabError: state.app.remoteTabError,
      importingTab: state.app.importingTab,
      tabs: selected.tabs,
      transactions: selected.transactions,
      accounts: selected.accounts,
      participants: selected.participants,
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
