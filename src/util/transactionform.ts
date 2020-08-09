import {
  TransactionFormState,
  Account,
  Transaction,
  TransactionFormParticipantInputType as InputType,
  TransactionFormParticipantStatus as Status,
  TransactionType,
  DocumentType,
  TransactionFormSharedState,
} from "../types";
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import orderBy from "lodash.orderby";
import { formatDate, parseDate } from "./date";

export const NEW_PARTICIPANT_OPTION = "NEW_PARTICIPANT";

export function createNewParticipant() {
  return {
    id: uuidv4(),
    inputType: InputType.NEW,
    status: Status.JOINED,
  };
}

function createParticipantInputDataForEmptyTab(): TransactionFormState["shared"] {
  return [1, 2].map(() => createNewParticipant());
}

function createParticipantInputData(
  accounts: Account[],
  transaction?: Transaction
): TransactionFormState["shared"] {
  if (!accounts.length) {
    return createParticipantInputDataForEmptyTab();
  }

  const participantInputs: TransactionFormState["shared"] = accounts.map(
    (account) => {
      let status;
      let amount;
      if (transaction) {
        const value = transaction.participants.find((participantValue) => {
          return participantValue.participant === account.participant;
        });
        status =
          value && value.amount > 0
            ? Status.PAID
            : value && value.amount === 0
            ? Status.JOINED
            : Status.NONE;
        if (value?.amount !== undefined && value.amount > 0) {
          amount = value.amount;
        }
      } else {
        // For exactly two people in the tab, always set JOINED
        status = accounts.length === 2 ? Status.JOINED : Status.NONE;
      }

      return {
        id: uuidv4(),
        inputType: InputType.EXISTING,
        participant: account.participant,
        status,
        amount,
      };
    }
  );

  // sort participants by 1) amount paid 2) joined 3) alphabetical
  return orderBy(
    participantInputs,
    ["status", "amount", "participant"],
    ["desc", "desc", "asc"]
  );
}

interface Inputs {
  from?: string;
  to?: string;
  amount?: number;
}

function transactionParticipants2Inputs(participants: Account[]): Inputs {
  var result: Inputs = {};

  for (var i = 0; i < participants.length; ++i) {
    var participant = participants[i];

    if (!result.amount) {
      result.amount = Math.abs(participant.amount);
    }

    if (!result.from && participant.amount > 0) {
      result.from = participant.participant;
    }

    if (!result.to && participant.amount < 0) {
      result.to = participant.participant;
    }
  }

  return result;
}

function createDirectInputData(
  accounts: Account[],
  transaction?: Transaction
): TransactionFormState["direct"] {
  var inputProps = transactionParticipants2Inputs(
    transaction?.participants || []
  );

  var mostNegativeParticipant = accounts[0]?.participant;
  var mostPositiveParticipant =
    accounts[accounts.length - 1] && accounts[accounts.length - 1].participant;

  var tabParticipants = accounts.map(function (account) {
    return account.participant;
  });
  var options = tabParticipants.concat(NEW_PARTICIPANT_OPTION);

  return {
    options,
    from: inputProps.from || mostNegativeParticipant || NEW_PARTICIPANT_OPTION,
    to: inputProps.to || mostPositiveParticipant || NEW_PARTICIPANT_OPTION,
    amount: inputProps.amount,
  };
}

export function createFormData(
  accounts: Account[],
  transaction?: Transaction
): TransactionFormState {
  const shared = createParticipantInputData(
    accounts,
    transaction?.transactionType === TransactionType.SHARED
      ? transaction
      : undefined
  );
  const direct = createDirectInputData(
    accounts,
    transaction?.transactionType === TransactionType.DIRECT
      ? transaction
      : undefined
  );
  const form: TransactionFormState = {
    transactionType: TransactionType.SHARED,
    date: formatDate(new Date()),
    shared,
    direct,
  };

  if (transaction) {
    form.transactionType = transaction.transactionType;
    form.date = formatDate(parseDate(transaction.date));
    form.description = transaction.description;
  }

  return form;
}

function mapParticipant(
  participant: TransactionFormSharedState
): Account | undefined {
  if (!participant.participant || participant.status === Status.NONE) {
    return;
  }

  return {
    participant: participant.participant,
    amount:
      participant.status === Status.PAID && participant.amount
        ? participant.amount
        : 0,
  };
}

function mapParticipantsOfSharedTransaction(
  participants: TransactionFormState["shared"]
): Account[] {
  return participants
    .map(mapParticipant)
    .filter((participant) => participant) as Account[];
}

function mapParticipantsOfDirectTransaction(
  direct: TransactionFormState["direct"]
): Account[] {
  const participants = [
    {
      participant:
        direct.from === NEW_PARTICIPANT_OPTION ? direct.fromNew : direct.from,
      amount: direct.amount,
    },
    {
      participant:
        direct.to === NEW_PARTICIPANT_OPTION ? direct.toNew : direct.to,
      amount: -(direct.amount as number),
    },
  ] as Account[];

  return participants;
}

export function mapFormDataToTransaction(
  formData: TransactionFormState,
  tabId: string,
  id?: string
): Transaction {
  let participants: Account[];
  if (formData.transactionType === TransactionType.SHARED) {
    participants = mapParticipantsOfSharedTransaction(formData.shared);
  } else {
    participants = mapParticipantsOfDirectTransaction(formData.direct);
  }

  return {
    id: id || uuidv4(),
    type: DocumentType.TRANSACTION,
    tabId,
    timestamp: new Date().toJSON(),
    transactionType: formData.transactionType,
    description: formData.description || "",
    date: formData.date,
    participants,
  };
}

function validateShared(participants: TransactionFormState["shared"]): boolean {
  var joinedParticipants = participants.filter(function (participant) {
    return participant.status > 0;
  });

  if (joinedParticipants.length < 2) {
    return false;
  }

  // every joined participant needs a name
  for (var i = 0; i < joinedParticipants.length; i++) {
    if (!joinedParticipants[i].participant) {
      return false;
    }
  }

  var payingParticipants = joinedParticipants.filter(function (participant) {
    return participant.status === Status.PAID && participant.amount;
  });
  if (!payingParticipants.length) {
    return false;
  }

  return true;
}

function validateDirect(data: TransactionFormState["direct"]): boolean {
  const from = data.from === NEW_PARTICIPANT_OPTION ? data.fromNew : data.from;
  const to = data.to === NEW_PARTICIPANT_OPTION ? data.toNew : data.to;
  return !!from && !!to && !!data.amount && from !== to;
}

export function validate(data: TransactionFormState): boolean {
  if (!data.description) {
    return false;
  }

  if (!data.date) {
    return false;
  }

  if (data.transactionType === TransactionType.DIRECT) {
    return validateDirect(data.direct);
  } else {
    return validateShared(data.shared);
  }
}
