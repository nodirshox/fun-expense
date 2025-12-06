export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  note: string;
  date: Date;
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  type: TransactionType;
}

export interface Settings {
  displayName: string;
  currency: string;
  currencySymbol: string;
  avatar: string;
}
