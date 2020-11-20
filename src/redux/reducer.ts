import iarray from "../util/immutablearray";
import {
  ActionMap,
  DocumentType,
  Entity,
  TransactionFormState,
  TransactionFormParticipantStatus,
} from "../types";
import { Reducer } from "redux";
import {
  GTAction,
  UPDATE_FROM_DB,
  CREATE_TAB,
  CHECK_REMOTE_TAB,
  CHECK_REMOTE_TAB_FAILURE,
  IMPORT_TAB,
  CREATE_OR_UPDATE_TRANSACTION,
  REMOVE_TRANSACTION,
  SET_TRANSACTION_FORM,
  RESET_TRANSACTION_FORM,
  SET_ERROR,
  ROUTE_TABS,
  ROUTE_TAB,
  UPDATE_TRANSACTION_FORM,
  UPDATE_TRANSACTION_DIRECT_FORM,
  UPDATE_TRANSACTION_PARTICIPANT,
  ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM,
  SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM,
  SET_CREATE_TAB_INPUT_VALUE,
  RESET_CREATE_TAB_INPUT_VALUE,
  SET_IMPORT_TAB_INPUT_VALUE,
  RESET_IMPORT_TAB_INPUT_VALUE,
} from "./actioncreators";
import { createNewParticipant } from "../util/transactionform";

interface AppState {
  initialLoadingDone: boolean;
  checkingRemoteTab: boolean;
  remoteTabError: string;
  importingTab: boolean;
  docsById: { [id: string]: Entity };
  tabs: string[];
  transactionsByTab: { [tabId: string]: string[] };
  createTabInput?: string;
  importTabInput?: string;
  transactionForm?: TransactionFormState;
  error: any;
}

const initialState: AppState = {
  initialLoadingDone: false,
  checkingRemoteTab: false,
  remoteTabError: "",
  importingTab: false,
  docsById: {},
  tabs: [],
  transactionsByTab: {},
  error: null,
};

function docsReducer(state: AppState, actionMap: ActionMap): AppState {
  let docsById = state.docsById;
  let tabs = state.tabs;
  let transactionsByTab = state.transactionsByTab;

  actionMap.delete.forEach((dbDoc) => {
    const doc = docsById[dbDoc.id];

    if (!doc) {
      return;
    }

    docsById = { ...docsById };
    delete docsById[doc.id];

    const tabId = dbDoc.tabId;
    if (doc.type === DocumentType.TRANSACTION) {
      const transactions = transactionsByTab[tabId]!;
      transactionsByTab = {
        ...transactionsByTab,
        [tabId]: iarray.removeItem(transactions, doc.id),
      };
    }
  });

  actionMap.createOrUpdate.forEach((doc) => {
    const tabId = doc.tabId;

    if (doc.type === DocumentType.INFO) {
      doc = {
        ...doc,
        id: "info-" + tabId,
      };

      tabs = iarray.addUniq(tabs, tabId);
    }

    docsById = {
      ...docsById,
      [doc.id]: doc,
    };

    if (doc.type === DocumentType.TRANSACTION) {
      transactionsByTab = {
        ...transactionsByTab,
        [tabId]: iarray.addUniq(transactionsByTab[tabId] || [], doc.id),
      };
    }
  });

  return {
    ...state,
    docsById,
    tabs,
    transactionsByTab,
  };
}

const reducer: Reducer<AppState, GTAction> = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FROM_DB:
      return {
        ...docsReducer(state, action.actionMap),
        initialLoadingDone: true,
        importingTab: false,
      };

    case CREATE_TAB:
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: [],
        }),
      };

    case CHECK_REMOTE_TAB:
      return {
        ...state,
        checkingRemoteTab: true,
        remoteTabError: initialState.remoteTabError,
      };

    case CHECK_REMOTE_TAB_FAILURE:
      return {
        ...state,
        checkingRemoteTab: false,
        remoteTabError: action.error,
      };

    case IMPORT_TAB:
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: [],
        }),
        checkingRemoteTab: false,
        remoteTabError: initialState.remoteTabError,
        importingTab: true,
      };

    case CREATE_OR_UPDATE_TRANSACTION:
      return {
        ...docsReducer(state, {
          createOrUpdate: [action.doc],
          delete: [],
        }),
      };

    case REMOVE_TRANSACTION:
      return {
        ...docsReducer(state, {
          createOrUpdate: [],
          delete: [action.doc],
        }),
      };

    case SET_CREATE_TAB_INPUT_VALUE:
      return {
        ...state,
        createTabInput: action.value,
      };

    case RESET_CREATE_TAB_INPUT_VALUE:
      return {
        ...state,
        createTabInput: initialState.createTabInput,
      };

    case SET_IMPORT_TAB_INPUT_VALUE:
      return {
        ...state,
        importTabInput: action.value,
      };

    case RESET_IMPORT_TAB_INPUT_VALUE:
      return {
        ...state,
        importTabInput: initialState.importTabInput,
      };

    case SET_TRANSACTION_FORM:
      return {
        ...state,
        transactionForm: action.payload,
      };

    case RESET_TRANSACTION_FORM:
      return {
        ...state,
        transactionForm: initialState.transactionForm,
      };

    case UPDATE_TRANSACTION_FORM:
      if (!state.transactionForm) {
        throw new Error();
      }
      return {
        ...state,
        transactionForm: {
          ...state.transactionForm,
          [action.key]: action.value,
        },
      };

    case UPDATE_TRANSACTION_DIRECT_FORM:
      if (!state.transactionForm) {
        throw new Error();
      }
      return {
        ...state,
        transactionForm: {
          ...state.transactionForm,
          direct: {
            ...state.transactionForm.direct,
            [action.key]: action.value,
          },
        },
      };

    case UPDATE_TRANSACTION_PARTICIPANT: {
      if (!state.transactionForm) {
        throw new Error();
      }
      const participants = [...state.transactionForm.shared];
      const idx = participants.findIndex((p) => p.id === action.id);
      if (idx === -1) {
        throw new Error();
      }
      participants[idx] = {
        ...participants[idx]!,
        [action.key]: action.value,
      };

      return {
        ...state,
        transactionForm: {
          ...state.transactionForm,
          shared: participants,
        },
      };
    }

    case ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM:
      if (!state.transactionForm) {
        throw new Error();
      }
      return {
        ...state,
        transactionForm: {
          ...state.transactionForm,
          shared: state.transactionForm.shared.concat(createNewParticipant()),
        },
      };

    case SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM:
      if (!state.transactionForm) {
        throw new Error();
      }
      return {
        ...state,
        transactionForm: {
          ...state.transactionForm,
          shared: state.transactionForm.shared.map((participant) => {
            if (participant.status > TransactionFormParticipantStatus.NONE) {
              return participant;
            }
            return {
              ...participant,
              status: TransactionFormParticipantStatus.JOINED,
            };
          }),
        },
      };

    case SET_ERROR:
      return {
        ...state,
        error: {
          error: action.error,
          info: action.info,
        },
      };

    case ROUTE_TABS:
    case ROUTE_TAB:
      return {
        ...state,
        remoteTabError: initialState.remoteTabError,
      };

    default:
      return state;
  }
};

export default reducer;
