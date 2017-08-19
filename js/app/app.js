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
      scene: state.currentScene,
      homeView: state.homeView,
      tabId: state.currentTab,
      tabName: selected.tabName,
      transaction: state.currentTransaction,
      checkingRemoteTab: state.checkingRemoteTab,
      remoteTabError: state.remoteTabError,
      importingTab: state.importingTab,
      tabs: selected.tabs,
      transactions: selected.transactions,
      accounts: selected.accounts,
      participants: selected.participants
    };
  }

  var mapDispatchToProps = {
    onNavigateToTabs: actionCreators.navigateToTabs,
    onCreateTab: actionCreators.createTab,
    onImportTab: actionCreators.importTab,
    onSelectTab: actionCreators.selectTab,
    onNavigateToAddTransaction: actionCreators.navigateToAddTransaction,
    onNavigateToUpdateTransaction: actionCreators.navigateToUpdateTransaction,
    onNavigateToList: actionCreators.navigateToList,
    onNavigateToMain: actionCreators.navigateToMain,
    onCloseTransaction: actionCreators.closeTransaction,
    onAddTransaction: actionCreators.addTransaction,
    onUpdateTransaction: actionCreators.updateTransaction,
    onRemoveTransaction: actionCreators.removeTransaction
  };

  return ReactRedux.connect(mapStateToProps, mapDispatchToProps)(App);

});
