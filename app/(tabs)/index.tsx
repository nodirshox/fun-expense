import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { PieChart } from 'lucide-react-native';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { Transaction } from '@/types/transaction';

export default function HomeScreen() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);
  const { settings, reloadSettings, loading: settingsLoading } = useSettings();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getTotalIncome,
    getTotalExpenses,
    loading: transactionsLoading,
  } = useTransactions();

  // Reload settings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      reloadSettings();
    }, [])
  );

  const handleOpenModal = () => {
    setEditingTransaction(undefined);
    setIsModalOpen(true);
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(undefined);
  };

  if (settingsLoading || transactionsLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
              <Text style={styles.avatarEmoji}>{settings.avatar}</Text>
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.name}>{settings.displayName} ✨</Text>
            </View>
            <TouchableOpacity style={styles.analyticsButton} onPress={() => router.push('/analytics')}>
              <PieChart size={20} color="#F1635A" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceSection}>
            <BalanceCard
              balance={getBalance()}
              income={getTotalIncome()}
              expenses={getTotalExpenses()}
              currencySymbol={settings.currencySymbol}
            />
          </View>

          {/* Transactions List */}
          <TransactionList
            transactions={transactions}
            onPress={handleTransactionPress}
            currencySymbol={settings.currencySymbol}
          />
        </View>
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity style={styles.fab} onPress={handleOpenModal}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAdd={addTransaction}
        onUpdate={updateTransaction}
        onDelete={deleteTransaction}
        transaction={editingTransaction}
        currencySymbol={settings.currencySymbol}
      />
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: '#E8E5FF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  analyticsButton: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceSection: {
    marginBottom: 24,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F1635A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});
