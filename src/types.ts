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

export enum TransactionFormParticipantStatus {
  NONE = 0, JOINED = 1, PAID = 2,
}

export enum TransactionFormParticipantInputType {
  NEW, EXISTING,
}

export interface TransactionFormSharedState {
  id: string;
  inputType: TransactionFormParticipantInputType;
  participant?: string;
  status: TransactionFormParticipantStatus;
  amount?: number;
}

interface TransactionFormDirectState {
  from?: string;
  fromNew?: string;
  to?: string;
  toNew?: string;
  amount?: number;
  options: string[];
}

export interface TransactionFormState {
  transactionType: TransactionType;
  date: string;
  description?: string;
  shared: TransactionFormSharedState[];
  direct: TransactionFormDirectState;
}
