export interface ActionMap {
  createOrUpdate: any[];
  delete: any[];
}

export enum DocumentType {
  TRANSACTION = 'transaction',
  INFO = 'info',
}

export enum TransactionType {
  SHARED = 'SHARED',
  DIRECT = 'DIRECT',
}

export interface Account {
  participant: string;
  amount: number;
}

export interface Transaction {
  id: string;
  type: DocumentType.TRANSACTION;
  tabId: string;
  timestamp: string;
  transactionType: TransactionType;
  description: string;
  date: string;
  participants: Account[];
}

export interface Info {
  id: string;
  type: DocumentType.INFO;
  tabId: string;
  name: string;
}

export type Entity = Transaction | Info;

export interface Tab {
  id: string;
  info: Info;
  mostRecentTransaction?: Transaction;
}
