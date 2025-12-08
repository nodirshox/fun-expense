import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { getCategoryById } from '@/data/categories';
import { CategoryList } from '@/components/CategoryList';
import { DonutChart } from '@/components/DonutChart';
import { Shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CategoryData {
  name: string;
  emoji: string;
  value: number;
  color: string;
}

const formatCurrency = (amount: number, symbol: string) => {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { transactions, getTotalExpenses, getTotalIncome, loading: transactionsLoading } = useTransactions();
  const { settings, loading: settingsLoading } = useSettings();

  const getCategoryData = (type: 'expense' | 'income'): CategoryData[] => {
    const filtered = transactions.filter(t => t.type === type);
    const grouped = filtered.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([categoryId, amount]) => {
        const category = getCategoryById(categoryId);
        return {
          name: category?.name || categoryId,
          emoji: category?.emoji || '📦',
          value: amount,
          color: category?.color || '#B0B0B0',
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  if (settingsLoading || transactionsLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  const expenseData = getCategoryData('expense');
  const incomeData = getCategoryData('income');
  const totalExpenses = getTotalExpenses();
  const totalIncome = getTotalIncome();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color="#1a1a1a" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Analytics</Text>
              <Text style={styles.headerSubtitle}>Where your money goes 📊</Text>
            </View>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📊</Text>
              <Text style={styles.emptyText}>Add some transactions first!</Text>
            </View>
          ) : (
            <>
              {/* Expenses Section */}
              {expenseData.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>💸 Expenses</Text>
                    <Text style={styles.expenseTotal}>
                      {formatCurrency(totalExpenses, settings.currencySymbol)}
                    </Text>
                  </View>

                  <TouchableWithoutFeedback>
                    <View style={styles.chartContainer}>
                      <DonutChart
                        data={expenseData}
                        size={220}
                        strokeWidth={40}
                        gap={8}
                        currencySymbol={settings.currencySymbol}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <CategoryList
                    data={expenseData}
                    total={totalExpenses}
                    currencySymbol={settings.currencySymbol}
                  />
                </View>
              )}

              {/* Income Section */}
              {incomeData.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>💰 Income</Text>
                    <Text style={styles.incomeTotal}>
                      {formatCurrency(totalIncome, settings.currencySymbol)}
                    </Text>
                  </View>

                  <TouchableWithoutFeedback>
                    <View style={styles.chartContainer}>
                      <DonutChart
                        data={incomeData}
                        size={220}
                        strokeWidth={40}
                        gap={8}
                        currencySymbol={settings.currencySymbol}
                      />
                    </View>
                  </TouchableWithoutFeedback>

                  <CategoryList
                    data={incomeData}
                    total={totalIncome}
                    currencySymbol={settings.currencySymbol}
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
  },
  expenseTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1635A',
    fontFamily: 'Nunito_700Bold',
  },
  incomeTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#52C5B6',
    fontFamily: 'Nunito_700Bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    ...Shadows.card,
  },
});
