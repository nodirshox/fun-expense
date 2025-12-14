import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { PieChart } from 'lucide-react-native';
import { BalanceCard } from '@/components/BalanceCard';
import { TransactionList } from '@/components/TransactionList';
import { AddTransactionModal } from '@/components/AddTransactionModal';
import { WalletSelector } from '@/components/WalletSelector';
import { useTransactions } from '@/hooks/useTransactions';
import { useSettings } from '@/hooks/useSettings';
import { useWallets } from '@/hooks/useWallets';
import { Transaction } from '@/types/transaction';
import { Shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
    getTransactionsByWallet,
    loading: transactionsLoading,
  } = useTransactions();
  const {
    wallets,
    selectedWallet,
    selectedWalletId,
    selectWallet,
    addWallet,
    deleteWallet,
    isLoading: walletsLoading,
  } = useWallets();

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

  if (settingsLoading || transactionsLoading || walletsLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  // Get wallet-specific data
  const walletTransactions = getTransactionsByWallet(selectedWalletId);
  const walletBalance = getBalance(selectedWalletId);
  const walletIncome = getTotalIncome(selectedWalletId);
  const walletExpenses = getTotalExpenses(selectedWalletId);
  const displayCurrencyCode = selectedWallet?.currency || 'USD';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
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

          {/* Wallet Selector */}
          <View style={styles.walletSection}>
            <WalletSelector
              wallets={wallets}
              selectedWallet={selectedWallet}
              onSelect={selectWallet}
              onAdd={addWallet}
              onDelete={deleteWallet}
            />
          </View>

          {/* Balance Card */}
          <View style={styles.balanceSection}>
            <BalanceCard
              balance={walletBalance}
              income={walletIncome}
              expenses={walletExpenses}
              currencySymbol={displayCurrencyCode}
            />
          </View>

          {/* Transactions Section */}
          <View>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Transactions</Text>
              <TouchableOpacity onPress={() => router.push('/transactions')}>
                <Text style={styles.showAllText}>Show all</Text>
              </TouchableOpacity>
            </View>
            <TransactionList
              transactions={walletTransactions.slice(0, 3)}
              onPress={handleTransactionPress}
              currencySymbol={displayCurrencyCode}
            />
          </View>
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
        currencySymbol={displayCurrencyCode}
        walletId={selectedWalletId}
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
    ...Shadows.soft,
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
    fontFamily: 'Nunito_400Regular',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
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
  walletSection: {
    marginBottom: 16,
  },
  balanceSection: {
    marginBottom: 24,
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
  showAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#F1635A',
    fontFamily: 'Nunito_600SemiBold',
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
    ...Shadows.glowExpense,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
    fontFamily: 'Nunito_400Regular',
  },
});
