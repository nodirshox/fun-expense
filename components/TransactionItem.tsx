import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/data/categories';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
  currencySymbol: string;
}

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (date: Date) => {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const day = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
};

export const TransactionItem = ({ transaction, onPress, currencySymbol }: TransactionItemProps) => {
  const category = getCategoryById(transaction.category);
  const isExpense = transaction.type === 'expense';

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(transaction)} activeOpacity={0.7}>
      <View style={[styles.iconContainer, isExpense ? styles.iconExpense : styles.iconIncome]}>
        <Text style={styles.emoji}>{category?.emoji || '💸'}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={1}>
          {transaction.note || category?.name || 'Transaction'}
        </Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={[styles.amount, isExpense ? styles.amountExpense : styles.amountIncome]}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount, currencySymbol)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconExpense: {
    backgroundColor: '#FFEBEE',
  },
  iconIncome: {
    backgroundColor: '#E8F5E9',
  },
  emoji: {
    fontSize: 24,
  },
  details: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#666',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amountExpense: {
    color: '#F44336',
  },
  amountIncome: {
    color: '#4CAF50',
  },
});
