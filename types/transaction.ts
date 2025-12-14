export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: Date;
  walletId: string;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  type: TransactionType;
  color: string;
}

export interface Settings {
  displayName: string;
  avatar: string;
}
