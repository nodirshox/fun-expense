import { View, Text, StyleSheet } from 'react-native';

interface BalanceCardProps {
  balance: number;
  income: number;
  expenses: number;
  currencySymbol: string;
}

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export const BalanceCard = ({ balance, income, expenses, currencySymbol }: BalanceCardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Balance</Text>
      <Text style={styles.balance}>{formatCurrency(balance, currencySymbol)}</Text>

      <View style={styles.statsContainer}>
        <View style={[styles.statBox, styles.incomeBox]}>
          <View style={styles.statHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>↗</Text>
            </View>
            <Text style={styles.statLabel}>Income</Text>
          </View>
          <Text style={styles.incomeAmount}>{formatCurrency(income, currencySymbol)}</Text>
        </View>

        <View style={[styles.statBox, styles.expenseBox]}>
          <View style={styles.statHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.icon}>↘</Text>
            </View>
            <Text style={styles.statLabel}>Expenses</Text>
          </View>
          <Text style={styles.expenseAmount}>{formatCurrency(expenses, currencySymbol)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  incomeBox: {
    backgroundColor: '#E8F5E9',
  },
  expenseBox: {
    backgroundColor: '#FFEBEE',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
});
