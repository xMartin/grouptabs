import { connect, ConnectedProps } from "react-redux";
import {
  getTabInfo,
  getTotal,
  getTabs,
  getTransactions,
  getAccounts,
  getCurrentLocation,
} from "./redux/selectors";
import {
  navigateToTabs,
  selectTab,
  navigateToAddTransaction,
  navigateToUpdateTransaction,
  setError,
  createTab,
  importTab,
  closeTransaction,
  addOrUpdateTransaction,
  removeTransaction,
  resetTransactionForm,
  updateTransactionForm,
  updateTransactionSharedForm,
  updateTransactionDirectForm,
  updateTransactionParticipant,
  addParticipantToTransactionSharedForm,
  setAllJoinedOnTransactionSharedForm,
  setCreateTabInputValue,
  setImportTabInputValue,
} from "./redux/actioncreators";
import App from "./components/app";
import { AllState } from "./";
import { Transaction } from "./types";

function mapStateToProps(state: AllState) {
  return {
    location: state.location,
    currentLocation: getCurrentLocation(state),
    initialLoadingDone: state.app.initialLoadingDone,
    tabInfo: getTabInfo(state),
    transaction: state.app.docsById[
      state.location.payload.transactionId
    ] as Transaction,
    total: getTotal(state),
    checkingRemoteTab: state.app.checkingRemoteTab,
    remoteTabError: state.app.remoteTabError,
    importingTab: state.app.importingTab,
    createTabInputValue: state.app.createTabInput,
    importTabInputValue: state.app.importTabInput,
    tabs: getTabs(state),
    transactions: getTransactions(state),
    accounts: getAccounts(state),
    transactionFormState: state.app.transactionForm,
    error: state.app.error,
  };
}

const mapDispatchToProps = {
  onNavigateToTabs: navigateToTabs,
  onCreateTabInputChange: setCreateTabInputValue,
  onCreateTab: createTab,
  onImportTabInputChange: setImportTabInputValue,
  onImportTab: importTab,
  onSelectTab: selectTab,
  onNavigateToAddTransaction: navigateToAddTransaction,
  onNavigateToUpdateTransaction: navigateToUpdateTransaction,
  onCloseTransaction: closeTransaction,
  onAddOrUpdateTransaction: addOrUpdateTransaction,
  onRemoveTransaction: removeTransaction,
  onResetTransactionForm: resetTransactionForm,
  onUpdateTransactionForm: updateTransactionForm,
  onUpdateTransactionSharedForm: updateTransactionSharedForm,
  onUpdateTransactionDirectForm: updateTransactionDirectForm,
  onUpdateTransactionParticipant: updateTransactionParticipant,
  onAddParticipant: addParticipantToTransactionSharedForm,
  onSetAllJoined: setAllJoinedOnTransactionSharedForm,
  onError: setError,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

// https://react-redux.js.org/using-react-redux/static-typing#inferring-the-connected-props-automatically
export type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(App);
