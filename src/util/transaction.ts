import { Transaction, TransactionType } from "../types";

/**
 * Determines transaction type from transaction data.
 *
 * Old transaction data might not have `transactionType` specified as "DIRECT"
 * but semantically still be a direct transaction.
 */
function getTransactionType(transaction: Transaction): TransactionType {
  if (transaction.transactionType === TransactionType.DIRECT) {
    return transaction.transactionType;
  }

  // find out if it's a transaction with two participants where one paid amount X
  // and the other paid amount -X
  if (transaction.participants.length === 2) {
    const amounts = transaction.participants.map((participant) => {
      return participant.amount;
    });
    if (amounts[0] && amounts[0] === -amounts[1]!) {
      return TransactionType.DIRECT;
    }
  }

  return TransactionType.SHARED;
}

export function mapTransaction(transaction: Transaction): Transaction {
  const actualTransactionType = getTransactionType(transaction);

  if (transaction.transactionType !== actualTransactionType) {
    return {
      ...transaction,
      transactionType: actualTransactionType,
    };
  }

  return transaction;
}
