import { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Transaction, TransactionType } from '@/types/transaction';
import { getCategoriesByType } from '@/data/categories';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: {
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
    date: Date;
  }) => void;
  onUpdate?: (id: string, updates: {
    amount: number;
    type: TransactionType;
    category: string;
    note: string;
  }) => void;
  onDelete?: (id: string) => void;
  transaction?: Transaction;
  currencySymbol: string;
}

export const AddTransactionModal = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
  transaction,
  currencySymbol
}: AddTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const isEditMode = !!transaction;

  // Populate form when editing
  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setNote(transaction.note);
    } else {
      // Reset form when creating new
      setType('expense');
      setAmount('');
      setCategory('');
      setNote('');
    }
  }, [transaction, isOpen]);

  const categories = getCategoriesByType(type);

  const handleSubmit = () => {
    if (!amount || !category) return;

    if (isEditMode && transaction && onUpdate) {
      onUpdate(transaction.id, {
        amount: parseFloat(amount),
        type,
        category,
        note,
      });
    } else {
      onAdd({
        amount: parseFloat(amount),
        type,
        category,
        note,
        date: new Date(),
      });
    }

    setTimeout(onClose, 100);
  };

  const handleDelete = () => {
    if (isEditMode && transaction && onDelete) {
      onDelete(transaction.id);
      setTimeout(onClose, 100);
    }
  };

  const handleAmountChange = (value: string) => {
    const filtered = value.replace(/[^0-9.]/g, '');
    const parts = filtered.split('.');
    if (parts.length > 2) return;
    if (parts[1]?.length > 2) return;
    setAmount(filtered);
  };

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory('');
  };

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{isEditMode ? 'Edit Transaction' : 'Add Transaction'}</Text>
            <View style={styles.headerButtons}>
              {isEditMode && onDelete && (
                <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Type Selector */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.typeButtonExpenseActive,
                ]}
                onPress={() => handleTypeChange('expense')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'expense' && styles.typeButtonTextActive,
                  ]}
                >
                  💸 Expense
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.typeButtonIncomeActive,
                ]}
                onPress={() => handleTypeChange('income')}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    type === 'income' && styles.typeButtonTextActive,
                  ]}
                >
                  💰 Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={handleAmountChange}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Category Grid */}
            <View style={styles.section}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[
                      styles.categoryButton,
                      category === cat.id && type === 'expense' && styles.categoryButtonExpenseActive,
                      category === cat.id && type === 'income' && styles.categoryButtonIncomeActive,
                    ]}
                    onPress={() => setCategory(cat.id)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Note Input */}
            <View style={styles.section}>
              <Text style={styles.label}>Note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="What's this for?"
                placeholderTextColor="#999"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!amount || !category) && styles.submitButtonDisabled,
                amount && category && styles.submitButtonActive,
              ]}
              onPress={handleSubmit}
              disabled={!amount || !category}
            >
              <Text style={styles.submitButtonText}>
                {!amount || !category
                  ? 'Enter amount & category'
                  : isEditMode
                  ? '💾 Update Transaction'
                  : '🎉 Add Transaction'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    fontSize: 20,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: '#666',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
    gap: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonExpenseActive: {
    backgroundColor: '#F1635A',
  },
  typeButtonIncomeActive: {
    backgroundColor: '#52C5B6',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    paddingVertical: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonExpenseActive: {
    backgroundColor: '#FEE9E7',
    borderColor: '#F1635A',
  },
  categoryButtonIncomeActive: {
    backgroundColor: '#E6F7F5',
    borderColor: '#52C5B6',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  noteInput: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1a1a1a',
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonActive: {
    backgroundColor: '#6366f1',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
