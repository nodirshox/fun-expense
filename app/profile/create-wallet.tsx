import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SvgUri } from 'react-native-svg';
import { useWallets } from '@/hooks/useWallets';
import { WALLET_EMOJIS } from '@/types/wallet';
import { Shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCurrencies, Currency } from '@/hooks/useCurrencies';

export default function CreateWalletScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addWallet } = useWallets();
  const { currencies, isLoading: isCurrenciesLoading } = useCurrencies();

  const [walletName, setWalletName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(WALLET_EMOJIS[0]);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Set default currency when currencies are loaded
  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      setSelectedCurrency(currencies[0]);
    }
  }, [currencies]);

  const handleCreateWallet = async () => {
    if (!walletName.trim()) {
      Alert.alert('Error', 'Please enter a wallet name');
      return;
    }

    if (!selectedCurrency) {
      Alert.alert('Error', 'Please select a currency');
      return;
    }

    try {
      setIsCreating(true);

      await addWallet({
        name: walletName.trim(),
        emoji: selectedEmoji,
        currency: selectedCurrency.code,
        currencyId: selectedCurrency.id,
      });

      Alert.alert('Success', 'Wallet created successfully', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet');
      console.error('Error creating wallet:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color="#1a1a1a" />
            </TouchableOpacity>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Create New Wallet</Text>
              <Text style={styles.headerSubtitle}>Set up your wallet details</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formSection}>
            {/* Wallet Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Wallet Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Savings, Cash, Credit Card"
                value={walletName}
                onChangeText={setWalletName}
                maxLength={30}
                placeholderTextColor="#999"
              />
              <Text style={styles.inputHint}>
                {walletName.length}/30 characters
              </Text>
            </View>

            {/* Emoji Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Choose Icon</Text>
              <View style={styles.emojiGrid}>
                {WALLET_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiButton,
                      selectedEmoji === emoji && styles.emojiButtonActive,
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Currency Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Select Currency</Text>
              {isCurrenciesLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#52C5B6" />
                  <Text style={styles.loadingText}>Loading currencies...</Text>
                </View>
              ) : currencies.length > 0 ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.currencyScrollContainer}
                >
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.id}
                      style={[
                        styles.currencyButton,
                        selectedCurrency?.id === currency.id &&
                          styles.currencyButtonActive,
                      ]}
                      onPress={() => setSelectedCurrency(currency)}
                    >
                      <View style={styles.currencyFlagContainer}>
                        <SvgUri
                          uri={currency.flag}
                          width={40}
                          height={40}
                        />
                      </View>
                      <Text style={[
                        styles.currencyCode,
                        selectedCurrency?.id === currency.id &&
                          styles.currencyCodeActive,
                      ]}>
                        {currency.code}
                      </Text>
                      <Text style={styles.currencyName}>{currency.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>No currencies available</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[
            styles.createButton,
            (!walletName.trim() || isCreating) && styles.createButtonDisabled,
          ]}
          onPress={handleCreateWallet}
          disabled={!walletName.trim() || isCreating}
        >
          <Text style={styles.createButtonText}>
            {isCreating ? 'Creating...' : 'Create Wallet'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFAF8',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
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
  formSection: {
    gap: 24,
  },
  formGroup: {
    gap: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Nunito_600SemiBold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    fontFamily: 'Nunito_400Regular',
    ...Shadows.soft,
  },
  inputHint: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Nunito_400Regular',
    textAlign: 'right',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emojiButton: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.soft,
  },
  emojiButtonActive: {
    borderColor: '#52C5B6',
    backgroundColor: '#E8F8F6',
  },
  emojiText: {
    fontSize: 32,
  },
  currencyScrollContainer: {
    gap: 12,
    paddingRight: 16,
  },
  currencyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadows.soft,
  },
  currencyButtonActive: {
    borderColor: '#52C5B6',
    backgroundColor: '#E8F8F6',
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    fontFamily: 'Nunito_700Bold',
    marginBottom: 4,
  },
  currencySymbolActive: {
    color: '#52C5B6',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Nunito_600SemiBold',
    marginBottom: 2,
  },
  currencyCodeActive: {
    color: '#52C5B6',
  },
  currencyName: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Nunito_400Regular',
  },
  currencyFlag: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  currencyFlagContainer: {
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    gap: 12,
    ...Shadows.soft,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
  errorContainer: {
    padding: 20,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    fontFamily: 'Nunito_400Regular',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FCFAF8',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  createButton: {
    backgroundColor: '#52C5B6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    ...Shadows.soft,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Nunito_700Bold',
  },
});
