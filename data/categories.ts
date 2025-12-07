import { Category } from '@/types/transaction';

export const categories: Category[] = [
  // Expense categories
  { id: 'food', name: 'Food', emoji: '🍕', type: 'expense', color: '#FF6B6B' },
  { id: 'transport', name: 'Transport', emoji: '🚗', type: 'expense', color: '#4ECDC4' },
  { id: 'shopping', name: 'Shopping', emoji: '🛍️', type: 'expense', color: '#95E1D3' },
  { id: 'entertainment', name: 'Fun', emoji: '🎮', type: 'expense', color: '#A78BFA' },
  { id: 'bills', name: 'Bills', emoji: '📄', type: 'expense', color: '#FFA07A' },
  { id: 'health', name: 'Health', emoji: '💊', type: 'expense', color: '#FF8FAB' },
  { id: 'coffee', name: 'Coffee', emoji: '☕', type: 'expense', color: '#C19A6B' },
  { id: 'other-expense', name: 'Other', emoji: '📦', type: 'expense', color: '#B0B0B0' },

  // Income categories
  { id: 'salary', name: 'Salary', emoji: '💰', type: 'income', color: '#51CF66' },
  { id: 'freelance', name: 'Freelance', emoji: '💻', type: 'income', color: '#74C0FC' },
  { id: 'gift', name: 'Gift', emoji: '🎁', type: 'income', color: '#FFD93D' },
  { id: 'investment', name: 'Investment', emoji: '📈', type: 'income', color: '#6BCF7F' },
  { id: 'other-income', name: 'Other', emoji: '✨', type: 'income', color: '#FFB84D' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'expense' | 'income'): Category[] => {
  return categories.filter(cat => cat.type === type);
};
