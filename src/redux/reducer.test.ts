import {
  UPDATE_TRANSACTION_PARTICIPANT,
  updateTransactionParticipant,
  ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM,
  addParticipantToTransactionSharedForm,
  SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM,
  setAllJoinedOnTransactionSharedForm,
} from "./actioncreators";
import { AllState } from "../main";
import {
  TransactionType,
  TransactionFormParticipantInputType as InputType,
  TransactionFormParticipantStatus as Status,
} from "../types";
import reducer from "./reducer";

function createState(): Partial<AllState["app"]> {
  return {
    transactionForm: {
      transactionType: TransactionType.SHARED,
      date: "2020-02-20",
      direct: {
        options: [],
      },
      shared: [
        {
          id: "p2",
          inputType: InputType.EXISTING,
          participant: "Jan",
          status: Status.JOINED,
        },
        {
          id: "p1",
          inputType: InputType.EXISTING,
          participant: "Martin",
          status: Status.JOINED,
        },
      ],
    },
  };
}

describe(`${UPDATE_TRANSACTION_PARTICIPANT}`, () => {
  it("updates participant status", () => {
    const state = createState();
    const action = updateTransactionParticipant("p1", "status", Status.PAID);
    const result = reducer(state as any, action);

    const participants = result.transactionForm?.shared;
    if (!participants) {
      throw new Error();
    }
    expect(participants[1].status).toBe(Status.PAID);
    expect(participants).not.toBe(state.transactionForm?.shared);
  });
});

describe(`${ADD_PARTICIPANT_TO_TRANSACTION_SHARED_FORM}`, () => {
  it("adds participant input to new transaction form", () => {
    const state = createState();
    const action = addParticipantToTransactionSharedForm();
    const result = reducer(state as any, action);

    const participants = result.transactionForm?.shared;
    if (!participants) {
      throw new Error();
    }
    expect(participants.length).toBe(3);
    expect(participants[2].inputType).toBe(InputType.NEW);
    expect(participants[2].participant).toBeUndefined();
    expect(participants[2].status).toBe(Status.JOINED);
    expect(participants[2].amount).toBeUndefined();
    expect(participants).not.toBe(state.transactionForm?.shared);
  });
});

describe(`${SET_ALL_JOINED_ON_TRANSACTION_SHARED_FORM}`, () => {
  it("sets all participant inputs of status NONE to JOINED", () => {
    const state: Partial<AllState["app"]> = {
      transactionForm: {
        transactionType: TransactionType.SHARED,
        date: "2020-02-20",
        direct: {
          options: [],
        },
        shared: [
          {
            id: "p2",
            inputType: InputType.EXISTING,
            participant: "Jan",
            status: Status.JOINED,
          },
          {
            id: "p1",
            inputType: InputType.EXISTING,
            participant: "Martin",
            status: Status.NONE,
          },
          {
            id: "p3",
            inputType: InputType.EXISTING,
            participant: "Tilman",
            status: Status.PAID,
            amount: 12,
          },
          {
            id: "p8",
            inputType: InputType.EXISTING,
            participant: "Koos",
            status: Status.NONE,
          },
          {
            id: "p4",
            inputType: InputType.NEW,
            status: Status.JOINED,
          },
        ],
      },
    };
    const action = setAllJoinedOnTransactionSharedForm();
    const result = reducer(state as any, action);

    const participants = result.transactionForm?.shared;
    if (!participants) {
      throw new Error();
    }
    expect(participants.length).toBe(5);

    const statuss = participants.map((participant) => participant.status);
    expect(new Set(statuss)).toEqual(new Set([Status.PAID, Status.JOINED]));

    expect(participants).not.toBe(state.transactionForm?.shared);
  });
});
