import { DocumentType, Transaction, TransactionType } from "../types";
import { mapTransaction } from "./transaction";

test("converts legacy direct transactions' transaction type to DIRECT", () => {
  const sharedTransaction = {
    id: "1",
    type: DocumentType.TRANSACTION,
    tabId: "TAB_ID",
    transactionType: TransactionType.SHARED,
    date: "2020-08-02",
    participants: [
      {
        participant: "Simon",
        amount: 12,
      },
      {
        participant: "Jan",
        amount: 0,
      },
    ],
  } as Transaction;

  const directTransaction = {
    id: "2",
    type: DocumentType.TRANSACTION,
    tabId: "TAB_ID",
    transactionType: TransactionType.DIRECT,
    date: "2020-08-03",
    participants: [
      {
        participant: "Simon",
        amount: -12,
      },
      {
        participant: "Jan",
        amount: 12,
      },
    ],
  } as Transaction;

  const legacyDirectTransaction = {
    id: "3",
    type: DocumentType.TRANSACTION,
    tabId: "TAB_ID",
    transactionType: TransactionType.SHARED,
    date: "2020-08-01",
    participants: [
      {
        participant: "Jan",
        amount: -12,
      },
      {
        participant: "Simon",
        amount: 12,
      },
    ],
  } as Transaction;

  const mappedSharedTransaction = mapTransaction(sharedTransaction);
  expect(mappedSharedTransaction.transactionType).toBe(TransactionType.SHARED);
  expect(mappedSharedTransaction).toBe(sharedTransaction);

  const mappedDirectTransaction = mapTransaction(directTransaction);
  expect(mappedDirectTransaction.transactionType).toBe(TransactionType.DIRECT);
  expect(mappedDirectTransaction).toBe(directTransaction);

  const mappedLegacyDirectTransaction = mapTransaction(legacyDirectTransaction);
  expect(mappedLegacyDirectTransaction.transactionType).toBe(
    TransactionType.DIRECT,
  );
});
