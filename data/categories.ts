import { Category } from '@/types/transaction';

export const categories: Category[] = [
  // Expense categories
  { id: 'food', name: 'Food', emoji: '🍕', type: 'expense' },
  { id: 'transport', name: 'Transport', emoji: '🚗', type: 'expense' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', type: 'expense' },
  { id: 'entertainment', name: 'Fun', emoji: '🎮', type: 'expense' },
  { id: 'bills', name: 'Bills', emoji: '📄', type: 'expense' },
  { id: 'health', name: 'Health', emoji: '💊', type: 'expense' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', type: 'expense' },
  { id: 'other-expense', name: 'Other', emoji: '📦', type: 'expense' },

  // Income categories
  { id: 'salary', name: 'Salary', emoji: '💰', type: 'income' },
  { id: 'freelance', name: 'Freelance', emoji: '💻', type: 'income' },
  { id: 'gift', name: 'Gift', emoji: '🎁', type: 'income' },
  { id: 'investment', name: 'Investment', emoji: '📈', type: 'income' },
  { id: 'other-income', name: 'Other', emoji: '✨', type: 'income' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'expense' | 'income'): Category[] => {
  return categories.filter(cat => cat.type === type);
};
