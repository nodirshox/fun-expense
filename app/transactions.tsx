import { AddTransactionModal } from "@/components/AddTransactionModal";
import { TransactionList } from "@/components/TransactionList";
import { useSettings } from "@/hooks/useSettings";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction } from "@/types/transaction";
import { useFocusEffect, useRouter } from "expo-router";
import { ChevronDown, ChevronLeft } from "lucide-react-native";
import { Shadows } from "@/constants/theme";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TransactionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >(undefined);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);
  const { settings, reloadSettings, loading: settingsLoading } = useSettings();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loading: transactionsLoading,
  } = useTransactions();

  // Reload settings when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      reloadSettings();
    }, [])
  );

  // Filter transactions by current month
  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  // Format month and year
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Generate list of months for the picker (current year + past 2 years)
  const generateMonthsList = () => {
    const months = [];
    const currentYear = new Date().getFullYear();

    for (let year = currentYear; year >= currentYear - 2; year--) {
      for (let month = 11; month >= 0; month--) {
        const date = new Date(year, month, 1);
        // Only show months up to current month
        if (date <= new Date()) {
          months.push(date);
        }
      }
    }

    return months;
  };

  const monthsList = generateMonthsList();

  const handleMonthSelect = (date: Date) => {
    setCurrentMonth(date);
    setIsMonthPickerOpen(false);
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ChevronLeft size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Transactions</Text>
            <Text style={styles.headerSubtitle}>View all transactions</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Month Picker */}
        <TouchableOpacity
          style={styles.monthDisplay}
          onPress={() => setIsMonthPickerOpen(true)}
        >
          <Text style={styles.monthText}>{formatMonth(currentMonth)}</Text>
          <ChevronDown size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {filteredTransactions.length > 0 ? (
            <TransactionList
              transactions={filteredTransactions}
              onPress={handleTransactionPress}
              currencySymbol={settings.currencySymbol}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📭</Text>
              <Text style={styles.emptyStateText}>
                No transactions this month
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

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

      {/* Month Picker Modal */}
      <Modal
        visible={isMonthPickerOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMonthPickerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.monthPickerContainer}>
            <View style={styles.monthPickerHeader}>
              <Text style={styles.monthPickerTitle}>Select Month</Text>
              <TouchableOpacity onPress={() => setIsMonthPickerOpen(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={monthsList}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => {
                const isSelected =
                  item.getMonth() === currentMonth.getMonth() &&
                  item.getFullYear() === currentMonth.getFullYear();
                return (
                  <TouchableOpacity
                    style={[
                      styles.monthItem,
                      isSelected && styles.monthItemSelected,
                    ]}
                    onPress={() => handleMonthSelect(item)}
                  >
                    <Text
                      style={[
                        styles.monthItemText,
                        isSelected && styles.monthItemTextSelected,
                      ]}
                    >
                      {formatMonth(item)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCFAF8",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FCFAF8",
    gap: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.soft,
  },
  headerTextContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    fontFamily: "Nunito_700Bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Nunito_400Regular",
  },
  placeholder: {
    width: 40,
  },
  monthDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    ...Shadows.soft,
  },
  monthText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    fontFamily: "Nunito_600SemiBold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  monthPickerContainer: {
    backgroundColor: "#FCFAF8",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 40,
  },
  monthPickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  monthPickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a1a1a",
    fontFamily: "Nunito_700Bold",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
    fontWeight: "300",
  },
  monthItem: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  monthItemSelected: {
    backgroundColor: "#FEE9E7",
  },
  monthItemText: {
    fontSize: 16,
    color: "#1a1a1a",
    fontFamily: "Nunito_600SemiBold",
  },
  monthItemTextSelected: {
    color: "#F1635A",
    fontWeight: "bold",
    fontFamily: "Nunito_700Bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "Nunito_400Regular",
  },
});
