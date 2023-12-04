import DbManager from "../db/manager";
import { AllState, Services } from "../main";
import {
  Transaction,
  Info,
  ActionMap,
  DocumentType,
  TransactionFormState,
  TransactionFormSharedState,
} from "../types";
import { ThunkAction } from "redux-thunk";
import {
  createFormData,
  mapFormDataToTransaction,
} from "../util/transactionform";
import { getAccounts } from "./selectors";
import { Dispatch } from "redux";

export const CHECK_REMOTE_TAB = "CHECK_REMOTE_TAB";
export const CHECK_REMOTE_TAB_FAILURE = "CHECK_REMOTE_TAB_FAILURE";
export const CREATE_TAB = "CREATE_TAB";
export const IMPORT_TAB = "IMPORT_TAB";
export const IMPORT_TAB_SUCCESS = "IMPORT_TAB_SUCCESS";
export const UPDATE_FROM_DB = "UPDATE_FROM_DB";
export const CREATE_OR_UPDATE_TRANSACTION = "CREATE_OR_UPDATE_TRANSACTION";
export const REMOVE_TRANSACTION = "REMOVE_TRANSACTION";
export const SET_CREATE_TAB_INPUT_VALUE = "SET_CREATE_TAB_INPUT_VALUE";
export const RESET_CREATE_TAB_INPUT_VALUE = "RESET_CREATE_TAB_INPUT_VALUE";
export const SET_IMPORT_TAB_INPUT_VALUE = "SET_IMPORT_TAB_INPUT_VALUE";
export const RESET_IMPORT_TAB_INPUT_VALUE = "RESET_IMPORT_TAB_INPUT_VALUE";
export const SET_TRANSACTION_FORM = "SET_TRANSACTION_FORM";
export const RESET_TRANSACTION_FORM = "RESET_TRANSACTION_FORM";
export const UPDATE_TRANSACTION_FORM = "UPDATE_TRANSACTION_FORM";
export const UPDATE_TRANSACTION_SHARED_FORM = "UPDATE_TRANSACTION_SHARED_FORM";
export const UPDATE_TRANSACTION_DIRECT_FORM = "UPDATE_TRANSACTION_DIRECT_FORM";
export const UPDATE_TRANSACTION_PARTICIPANT = "UPDATE_TRANSACTION_PARTICIPANT";
export const ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM =
  "ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM";
export const SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM =
  "SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM";
export const SET_ERROR = "SET_ERROR";
export const ROUTE_TAB = "ROUTE_TAB";
export const ROUTE_TABS = "ROUTE_TABS";
export const ROUTE_TRANSACTION = "ROUTE_TRANSACTION";
export const ROUTE_NEW_TRANSACTION = "ROUTE_NEW_TRANSACTION";

interface CheckRemoteTabAction {
  type: typeof CHECK_REMOTE_TAB;
}

const createCheckRemoteTabAction = (): CheckRemoteTabAction => ({
  type: CHECK_REMOTE_TAB,
});

interface CheckRemoteTabFailureAction {
  type: typeof CHECK_REMOTE_TAB_FAILURE;
  error: string;
}

const createCheckRemoteTabFailureAction = (
  error: string
): CheckRemoteTabFailureAction => ({
  type: CHECK_REMOTE_TAB_FAILURE,
  error,
});

interface CreateTabAction {
  type: typeof CREATE_TAB;
  doc: Info;
}

const createCreateTabAction = (doc: Info): CreateTabAction => ({
  type: CREATE_TAB,
  doc,
});

interface ImportTabAction {
  type: typeof IMPORT_TAB;
  doc: Info;
}

const createImportTabAction = (doc: Info): ImportTabAction => ({
  type: IMPORT_TAB,
  doc,
});

interface ImportTabSuccessAction {
  type: typeof IMPORT_TAB_SUCCESS;
  actionMap: ActionMap;
}

const createImportTabSuccessAction = (
  actionMap: ActionMap
): ImportTabSuccessAction => ({
  type: IMPORT_TAB_SUCCESS,
  actionMap,
});

interface UpdateFromDbAction {
  type: typeof UPDATE_FROM_DB;
  actionMap: ActionMap;
}

const createUpdateFromDbAction = (
  actionMap: ActionMap
): UpdateFromDbAction => ({
  type: UPDATE_FROM_DB,
  actionMap,
});

interface CreateOrUpdateTransactionAction {
  type: typeof CREATE_OR_UPDATE_TRANSACTION;
  doc: Transaction;
}

const createCreateOrUpdateTransactionAction = (
  doc: Transaction
): CreateOrUpdateTransactionAction => ({
  type: CREATE_OR_UPDATE_TRANSACTION,
  doc,
});

interface RemoveTransactionAction {
  type: typeof REMOVE_TRANSACTION;
  doc: Transaction;
}

const createRemoveTransactionAction = (
  doc: Transaction
): RemoveTransactionAction => ({
  type: REMOVE_TRANSACTION,
  doc,
});

interface SetCreateTabInputValueAction {
  type: typeof SET_CREATE_TAB_INPUT_VALUE;
  value: string;
}

export const setCreateTabInputValue = (
  value: string
): SetCreateTabInputValueAction => ({
  type: SET_CREATE_TAB_INPUT_VALUE,
  value,
});

interface ResetCreateTabInputValueAction {
  type: typeof RESET_CREATE_TAB_INPUT_VALUE;
}

export const resetCreateTabInputValue = (): ResetCreateTabInputValueAction => ({
  type: RESET_CREATE_TAB_INPUT_VALUE,
});

interface SetImportTabInputValueAction {
  type: typeof SET_IMPORT_TAB_INPUT_VALUE;
  value: string;
}

export const setImportTabInputValue = (
  value: string
): SetImportTabInputValueAction => ({
  type: SET_IMPORT_TAB_INPUT_VALUE,
  value,
});

interface ResetImportTabInputValueAction {
  type: typeof RESET_IMPORT_TAB_INPUT_VALUE;
}

export const resetImportTabInputValue = (): ResetImportTabInputValueAction => ({
  type: RESET_IMPORT_TAB_INPUT_VALUE,
});

interface SetTransactionFormAction {
  type: typeof SET_TRANSACTION_FORM;
  payload: TransactionFormState;
}

const createSetTransactionFormAction = (
  payload: TransactionFormState
): SetTransactionFormAction => ({
  type: SET_TRANSACTION_FORM,
  payload,
});

interface ResetTransactionFormAction {
  type: typeof RESET_TRANSACTION_FORM;
}

export const resetTransactionForm = (): ResetTransactionFormAction => ({
  type: RESET_TRANSACTION_FORM,
});

interface UpdateTransactionFormAction<K extends keyof TransactionFormState> {
  type: typeof UPDATE_TRANSACTION_FORM;
  key: K;
  value: TransactionFormState[K];
}

export const updateTransactionForm = <K extends keyof TransactionFormState>(
  key: K,
  value: TransactionFormState[K]
): UpdateTransactionFormAction<K> => ({
  type: UPDATE_TRANSACTION_FORM,
  key,
  value,
});

interface UpdateTransactionSharedFormAction<
  K extends keyof TransactionFormState["shared"]
> {
  type: typeof UPDATE_TRANSACTION_SHARED_FORM;
  key: K;
  value: TransactionFormState["shared"][K];
}

export const updateTransactionSharedForm = <
  K extends keyof TransactionFormState["shared"]
>(
  key: K,
  value: TransactionFormState["shared"][K]
): UpdateTransactionSharedFormAction<K> => ({
  type: UPDATE_TRANSACTION_SHARED_FORM,
  key,
  value,
});

interface UpdateTransactionDirectFormAction<
  K extends keyof TransactionFormState["direct"]
> {
  type: typeof UPDATE_TRANSACTION_DIRECT_FORM;
  key: K;
  value: TransactionFormState["direct"][K];
}

export const updateTransactionDirectForm = <
  K extends keyof TransactionFormState["direct"]
>(
  key: K,
  value: TransactionFormState["direct"][K]
): UpdateTransactionDirectFormAction<K> => ({
  type: UPDATE_TRANSACTION_DIRECT_FORM,
  key,
  value,
});

interface UpdateTransactionParticipantAction<
  K extends "participant" | "status" | "amount"
> {
  type: typeof UPDATE_TRANSACTION_PARTICIPANT;
  id: string;
  key: K;
  value: TransactionFormSharedState[K];
}

export const updateTransactionParticipant = <
  K extends "participant" | "status" | "amount"
>(
  id: string,
  key: K,
  value: TransactionFormSharedState[K]
): UpdateTransactionParticipantAction<K> => ({
  type: UPDATE_TRANSACTION_PARTICIPANT,
  id,
  key,
  value,
});

interface AddParticipantToTransactionSharedFormAction {
  type: typeof ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM;
}

export const addParticipantToTransactionSharedForm =
  (): AddParticipantToTransactionSharedFormAction => ({
    type: ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM,
  });

interface SetAllJoinedOnTransactionSharedFormAction {
  type: typeof SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM;
}

export const setAllJoinedOnTransactionSharedForm =
  (): SetAllJoinedOnTransactionSharedFormAction => ({
    type: SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM,
  });

interface SetErrorAction {
  type: typeof SET_ERROR;
  error: any;
  info: any;
}

export const setError = (error: any, info: any): SetErrorAction => ({
  type: SET_ERROR,
  error,
  info,
});

interface SelectTabAction {
  type: typeof ROUTE_TAB;
  payload: { tabId: string };
}

export const selectTab = (id: string): SelectTabAction => ({
  type: ROUTE_TAB,
  payload: {
    tabId: id,
  },
});

interface NavigateToTabsAction {
  type: typeof ROUTE_TABS;
}

export const navigateToTabs = (): NavigateToTabsAction => ({
  type: ROUTE_TABS,
});

interface NavigateToUpdateTransactionAction {
  type: typeof ROUTE_TRANSACTION;
  payload: { tabId: string; transactionId: string };
}

export const navigateToUpdateTransaction = (
  tabId: string,
  transactionId: string
): NavigateToUpdateTransactionAction => ({
  type: ROUTE_TRANSACTION,
  payload: {
    tabId: tabId,
    transactionId: transactionId,
  },
});

interface NavigateToAddTransactionAction {
  type: typeof ROUTE_NEW_TRANSACTION;
  payload: { tabId: string };
}

export const navigateToAddTransaction = (
  tabId: string
): NavigateToAddTransactionAction => ({
  type: ROUTE_NEW_TRANSACTION,
  payload: {
    tabId: tabId,
  },
});

export type GTAction =
  | CheckRemoteTabAction
  | CheckRemoteTabFailureAction
  | CreateTabAction
  | ImportTabAction
  | ImportTabSuccessAction
  | UpdateFromDbAction
  | CreateOrUpdateTransactionAction
  | RemoveTransactionAction
  | SetCreateTabInputValueAction
  | ResetCreateTabInputValueAction
  | SetImportTabInputValueAction
  | ResetImportTabInputValueAction
  | SetTransactionFormAction
  | ResetTransactionFormAction
  | UpdateTransactionFormAction<keyof TransactionFormState>
  | UpdateTransactionSharedFormAction<keyof TransactionFormState["shared"]>
  | UpdateTransactionDirectFormAction<keyof TransactionFormState["direct"]>
  | UpdateTransactionParticipantAction<"participant" | "status" | "amount">
  | AddParticipantToTransactionSharedFormAction
  | SetAllJoinedOnTransactionSharedFormAction
  | SetErrorAction
  | SelectTabAction
  | NavigateToTabsAction
  | NavigateToUpdateTransactionAction
  | NavigateToAddTransactionAction;

export type GTThunkAction = ThunkAction<
  Promise<void>,
  AllState,
  Services,
  GTAction
>;

const generateTabId = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < 7; ++i) {
    result += chars.substr(Math.floor(Math.random() * chars.length), 1);
  }
  return result;
};

export const resetMainContentScrollPosition = () => {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.scrollTop = 0;
  }
};

const importTab = async (
  dispatch: (action: GTThunkAction | GTAction) => void,
  id: string,
  dbManager: DbManager,
  viaImportForm?: boolean
): Promise<void> => {
  dispatch(createCheckRemoteTabAction());

  try {
    const infoDoc = await dbManager.checkTab(id);
    dispatch(
      createImportTabAction({
        id: "info",
        type: DocumentType.INFO,
        name: infoDoc.name,
        tabId: id,
      })
    );

    if (viaImportForm) {
      dispatch(selectTab(id));
      dispatch(resetImportTabInputValue());
    }

    const localDocs = await dbManager.connectTab(id);
    dispatch(createImportTabSuccessAction(localDocs));
  } catch (error: any) {
    let message;
    if (error.name === "not_found") {
      message = 'Could not find a tab with the ID "' + id + '".';
    } else {
      message = "Error: unable to import tab. Please try again.";
    }
    dispatch(createCheckRemoteTabFailureAction(message));
    console.error(error);
  }
};

export const ensureConnectedDb =
  (): GTThunkAction =>
  async (dispatch, getState, { dbManager }) => {
    if (getState().app.initialLoadingDone) {
      return;
    }

    await dbManager.init((actionMap) => {
      dispatch(createUpdateFromDbAction(actionMap));
    });
    await dbManager.connect();
  };

export const createTab =
  (name: string): GTThunkAction =>
  async (dispatch, _getState, { dbManager }) => {
    const id = generateTabId();

    const doc: Info = {
      id: "info",
      type: DocumentType.INFO,
      name: name,
      tabId: id,
    };

    dispatch(createCreateTabAction(doc));
    dispatch(selectTab(id));
    dispatch(resetCreateTabInputValue());

    await dbManager.createTab(doc);
  };

export const importTabFromForm =
  (id: string): GTThunkAction =>
  async (dispatch, getState, { dbManager }) => {
    id = id.toLowerCase();
    // accept the full URL as input, too, e.g. "https://app.grouptabs.net/#/tabs/qm2vnl2" -> "qm2vnl2"
    id = id.replace(/.*?([a-z0-9]+$)/, "$1");

    // if tab is already imported, just show it
    if (getState().app.tabs.includes(id)) {
      dispatch(selectTab(id));
      dispatch(resetImportTabInputValue());
      return;
    }

    return importTab(dispatch, id, dbManager, true);
  };

export const importTabFromUrl =
  (id: string): GTThunkAction =>
  (dispatch, _getState, { dbManager }) => {
    return importTab(dispatch, id, dbManager);
  };

const resetTransactionFormDelayed = (dispatch: Dispatch) => {
  // reset form after scene transition
  setTimeout(() => dispatch(resetTransactionForm()), 400);
};

export const addOrUpdateTransaction =
  (): GTThunkAction =>
  async (dispatch, getState, { dbManager }) => {
    const state = getState();
    const tabId = state.location.payload.tabId;
    const transactionId = state.location.payload.transactionId;
    const formState = state.app.transactionForm;

    if (!tabId || !formState) {
      throw new Error();
    }

    const transaction = mapFormDataToTransaction(
      formState,
      tabId,
      transactionId
    );

    dispatch(createCreateOrUpdateTransactionAction(transaction));

    dispatch(selectTab(tabId));

    resetTransactionFormDelayed(dispatch);

    if (transactionId) {
      await dbManager.updateDoc(transaction);
    } else {
      await dbManager.createDoc(transaction);
    }
  };

export const removeTransaction =
  (): GTThunkAction =>
  async (dispatch, getState, { dbManager }) => {
    const state = getState();
    const id = state.location.payload.transactionId;
    let doc;
    if (id) {
      doc = state.app.docsById[id] as Transaction;
    }

    if (!id || !doc) {
      throw new Error();
    }

    dispatch(createRemoveTransactionAction(doc));

    const tabId = state.location.payload.tabId;
    dispatch(selectTab(tabId));

    resetTransactionFormDelayed(dispatch);

    await dbManager.deleteDoc(doc);
  };

export const closeTransaction =
  // eslint-disable-next-line @typescript-eslint/require-await
  (): GTThunkAction => async (dispatch, getState) => {
    const tabId = getState().location.payload.tabId;
    dispatch(selectTab(tabId));

    resetTransactionFormDelayed(dispatch);
  };

export const initTransactionForm =
  // eslint-disable-next-line @typescript-eslint/require-await
  (): GTThunkAction => async (dispatch, getState) => {
    const state = getState();
    const transactionId = state.location.payload.transactionId;
    const transaction = state.app.docsById[transactionId] as Transaction;

    if (transactionId && !transaction) {
      throw new Error(
        `No transaction in the store with the ID "${transactionId}"`
      );
    }

    const formState = createFormData(getAccounts(state), transaction);
    dispatch(createSetTransactionFormAction(formState));
  };
