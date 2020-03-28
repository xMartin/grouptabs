import { Account, TransactionType, TransactionFormParticipantStatus as Status, TransactionFormParticipantInputType as InputType, Transaction, DocumentType, TransactionFormState, TransactionFormSharedState } from '../types';
import { createFormData, NEW_PARTICIPANT_OPTION, mapFormDataToTransaction, validate } from './transactionform';
import dateUtils from './date';

describe('createFormData', () => {
  function expectSharedToBeLikeEmpty(participants: TransactionFormState['shared']) {
    const participantNames = participants.map((participant) => participant.participant);
    expect(participantNames).toEqual([undefined, undefined]);

    const inputTypes = participants.map((participant) => participant.inputType);
    expect(inputTypes).toEqual([InputType.NEW, InputType.NEW]);

    const statuss = participants.map((participant) => participant.status);
    expect(statuss).toEqual([Status.JOINED, Status.JOINED]);

    const amounts = participants.map((participant) => participant.amount);
    expect(amounts).toEqual([undefined, undefined]);
  }

  function expectSharedToBeLikeNew(participants: TransactionFormState['shared'], expectedParticpantNames: string[]) {
    const participantNames = participants.map((participant) => participant.participant);
    expect(participantNames).toEqual(expectedParticpantNames);

    const inputTypes = participants.map((participant) => participant.inputType);
    expect(new Set(inputTypes)).toEqual(new Set([InputType.EXISTING]));

    const statuss = participants.map((participant) => participant.status);
    expect(new Set(statuss)).toEqual(new Set([Status.NONE]));

    const amounts = participants.map((participant) => participant.amount);
    expect(new Set(amounts)).toEqual(new Set([undefined]));
  }

  function expectDirectToBeLikeEmpty(data: TransactionFormState['direct']) {
    expect(data.from).toBe(NEW_PARTICIPANT_OPTION);
    expect(data.to).toBe(NEW_PARTICIPANT_OPTION);
    expect(data.fromNew).toBeUndefined();
    expect(data.toNew).toBeUndefined();
    expect(data.options).toEqual([NEW_PARTICIPANT_OPTION]);
  }

  function expectDirectToBeLikeNew(data: TransactionFormState['direct'], accounts: Account[]) {
    const participants = accounts.map((account) => account.participant);

    expect(data.from).toBe(participants[0]);
    expect(data.to).toBe(participants[participants.length - 1]);
    expect(data.fromNew).toBeUndefined();
    expect(data.toNew).toBeUndefined();
    expect(data.options).toEqual(participants.concat(NEW_PARTICIPANT_OPTION));
  }

  it('creates empty form data for new tab', () => {
    const accounts: Account[] = [];

    const result = createFormData(accounts);

    expect(result.transactionType).toBe(TransactionType.SHARED);
    expect(result.description).toBeFalsy();
    expect(result.date).toBe(dateUtils.formatDate(new Date()));

    expectSharedToBeLikeEmpty(result.shared);
    expectDirectToBeLikeEmpty(result.direct);
  });

  it('creates empty form data for filled tab', () => {
    const accounts: Account[] = [
      {
        participant: 'Martin',
        amount: -25,
      },
      {
        participant: 'Jan',
        amount: 1,
      },
      {
        participant: 'Koos',
        amount: 24,
      },
    ];

    const result = createFormData(accounts);

    expect(result.transactionType).toBe(TransactionType.SHARED);
    expect(result.description).toBeFalsy();
    expect(result.date).toBe(dateUtils.formatDate(new Date()));

    // Expect participants ordered by name as they all have status NONE.
    expectSharedToBeLikeNew(result.shared, ['Jan', 'Koos', 'Martin']);
    expectDirectToBeLikeNew(result.direct, accounts);
  });

  it('creates shared transaction form data', () => {
    const accounts: Account[] = [
      {
        participant: 'Martin',
        amount: -25,
      },
      {
        participant: 'Jan',
        amount: 1,
      },
      {
        participant: 'Koos',
        amount: 24,
      },
    ];

    const transaction: Transaction = {
      id: '1',
      type: DocumentType.TRANSACTION,
      timestamp: '2020-02-20T20:20:20.202Z',
      tabId: '123',
      description: 'foo',
      date: '2020-02-20',
      transactionType: TransactionType.SHARED,
      participants: [
        {
          participant: 'Koos',
          amount: 0,
        },
        {
          participant: 'Martin',
          amount: 11,
        },
      ]
    };

    const result = createFormData(accounts, transaction);

    expect(result.transactionType).toBe(TransactionType.SHARED);

    // Expect participants ordered by name as they all have status NONE.
    const participants = result.shared.map((participant) => participant.participant);
    expect(participants).toEqual(['Martin', 'Koos', 'Jan']);
    const statuss = result.shared.map((participant) => participant.status);
    expect(statuss).toEqual([Status.PAID, Status.JOINED, Status.NONE]);

    const amounts = result.shared.map((participant) => participant.amount);
    expect(amounts).toEqual([11, undefined, undefined]);

    const inputTypes = result.shared.map((participant) => participant.inputType);
    expect(new Set(inputTypes)).toEqual(new Set([InputType.EXISTING]));  

    expectDirectToBeLikeNew(result.direct, accounts);
  });

  it('creates direct transaction form data', () => {
    const accounts: Account[] = [
      {
        participant: 'Martin',
        amount: -25,
      },
      {
        participant: 'Jan',
        amount: 1,
      },
      {
        participant: 'Koos',
        amount: 24,
      },
    ];

    const transaction: Transaction = {
      id: '1',
      type: DocumentType.TRANSACTION,
      timestamp: '2020-02-20T20:20:20.202Z',
      tabId: '123',
      description: 'foo',
      date: '2020-02-20',
      transactionType: TransactionType.DIRECT,
      participants: [
        {
          participant: 'Koos',
          amount: 3.5,
        },
        {
          participant: 'Martin',
          amount: -3.5,
        },
      ]
    };

    const result = createFormData(accounts, transaction);

    expect(result.transactionType).toBe(TransactionType.DIRECT);
    
    // Expect participants ordered by name as they all have status NONE.
    expectSharedToBeLikeNew(result.shared, ['Jan', 'Koos', 'Martin']);

    expect(result.direct.from).toBe('Koos');
    expect(result.direct.fromNew).toBeUndefined();
    expect(result.direct.to).toBe('Martin');
    expect(result.direct.toNew).toBeUndefined();
    expect(result.direct.options).toEqual(['Martin', 'Jan', 'Koos', NEW_PARTICIPANT_OPTION]);
  });
});

describe('mapFormDataToTransaction', () => {
  it('maps a shared transaction', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.SHARED,
      date: '2020-02-20',
      description: 'Description',
      shared: [
        {
          id: '1',
          inputType: InputType.EXISTING,
          participant: 'Martin',
          status: Status.JOINED,
        },
        {
          id: '2',
          inputType: InputType.EXISTING,
          participant: 'Jan',
          status: Status.PAID,
          amount: 11.5,
        },
        {
          id: '3',
          inputType: InputType.EXISTING,
          participant: 'Koos',
          status: Status.NONE,
        },
        {
          id: '4',
          inputType: InputType.NEW,
          participant: 'Tilman',
          status: Status.JOINED,
        },
        {
          id: '5',
          inputType: InputType.NEW,
          status: Status.JOINED,
        },
      ],
      direct: {
        options: []
      },
    };

    const transaction = mapFormDataToTransaction(formData, 'TABID', 'ID');

    expect(transaction.id).toBe('ID');
    expect(transaction.tabId).toBe('TABID');
    expect(transaction.transactionType).toBe(TransactionType.SHARED);
    expect(transaction.description).toBe(formData.description);
    expect(transaction.date).toBe(formData.date);
    expect(transaction.participants).toEqual([
      {
        participant: 'Martin',
        amount: 0,
      },
      {
        participant: 'Jan',
        amount: 11.5,
      },
      {
        participant: 'Tilman',
        amount: 0,
      },
    ]);
  });

  it('maps a direct transaction', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.DIRECT,
      date: '2020-02-20',
      description: 'Description',
      shared: [],
      direct: {
        from: 'Martin',
        to: 'Jan',
        amount: 10,
        options: []
      },
    };

    const transaction = mapFormDataToTransaction(formData, 'TABID', 'ID');

    expect(transaction.id).toBe('ID');
    expect(transaction.tabId).toBe('TABID');
    expect(transaction.transactionType).toBe(TransactionType.DIRECT);
    expect(transaction.description).toBe(formData.description);
    expect(transaction.date).toBe(formData.date);
    expect(transaction.participants).toEqual([
      {
        participant: 'Martin',
        amount: 10,
      },
      {
        participant: 'Jan',
        amount: -10,
      },
    ]);
  });

  it('maps a direct transaction with new participants', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.DIRECT,
      date: '2020-02-20',
      description: 'Description',
      shared: [],
      direct: {
        from: NEW_PARTICIPANT_OPTION,
        fromNew: 'Martin',
        to: NEW_PARTICIPANT_OPTION,
        toNew: 'Jan',
        amount: 10,
        options: []
      },
    };

    const transaction = mapFormDataToTransaction(formData, 'TABID', 'ID');

    expect(transaction.id).toBe('ID');
    expect(transaction.tabId).toBe('TABID');
    expect(transaction.transactionType).toBe(TransactionType.DIRECT);
    expect(transaction.description).toBe(formData.description);
    expect(transaction.date).toBe(formData.date);
    expect(transaction.participants).toEqual([
      {
        participant: 'Martin',
        amount: 10,
      },
      {
        participant: 'Jan',
        amount: -10,
      },
    ]);
  });
});

describe('validate', () => {
  it('validates a completed shared form', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.SHARED,
      description: 'Test',
      date: '2020-02-20',
      direct: {
        options: []
      },
      shared: [
        {
          id: '1',
          inputType: InputType.EXISTING,
          participant: 'Martin',
          status: Status.JOINED,
        },
        {
          id: '2',
          inputType: InputType.EXISTING,
          participant: 'Jan',
          status: Status.PAID,
          amount: 1,
        }
      ]
    };

    expect(validate(formData)).toBeTruthy();
  });

  it('does not validate an incomplete shared form', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.SHARED,
      description: 'test',
      date: '2020-02-20',
      direct: {
        options: []
      },
      shared: [
        {
          id: '1',
          inputType: InputType.EXISTING,
          participant: 'Martin',
          status: Status.JOINED,
        },
        {
          id: '2',
          inputType: InputType.EXISTING,
          participant: 'Jan',
          status: Status.NONE,
        }
      ]
    };

    expect(validate(formData)).toBeFalsy();
  });

  it('validates a completed direct form', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.DIRECT,
      description: 'Test',
      date: '2020-02-20',
      direct: {
        from: 'Martin',
        to: 'Jan',
        amount: 11,
        options: []
      },
      shared: []
    };

    expect(validate(formData)).toBeTruthy();
  });

  it('validates an incomplete direct form', () => {
    const formData: TransactionFormState = {
      transactionType: TransactionType.DIRECT,
      description: 'Test',
      date: '2020-02-20',
      direct: {
        from: NEW_PARTICIPANT_OPTION,
        to: 'Jan',
        amount: 11,
        options: []
      },
      shared: []
    };

    expect(validate(formData)).toBeFalsy();
  });
});