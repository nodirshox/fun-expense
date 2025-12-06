import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings, AVATARS, CURRENCIES } from '@/hooks/useSettings';

export default function ProfileScreen() {
  const router = useRouter();
  const { settings, updateSettings } = useSettings();
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(settings.displayName);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);

  const handleNameSave = async () => {
    if (tempName.trim()) {
      await updateSettings({ displayName: tempName.trim() });
    }
    setEditingName(false);
  };

  const handleAvatarSelect = async (avatar: string) => {
    await updateSettings({ avatar });
    setShowAvatarPicker(false);
  };

  const handleCurrencySelect = async (code: string, symbol: string) => {
    await updateSettings({
      currency: code,
      currencySymbol: symbol,
    });
    setShowCurrencyPicker(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.simpleHeader}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Customize your experience</Text>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowAvatarPicker(true)}
            >
              <Text style={styles.avatarEmoji}>{settings.avatar}</Text>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Tap to change avatar</Text>
          </View>

          {/* Settings Cards */}
          <View style={styles.settingsCards}>
            {/* Display Name */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Display Name</Text>
              {editingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    autoFocus
                    maxLength={20}
                    onSubmitEditing={handleNameSave}
                  />
                  <TouchableOpacity style={styles.saveButton} onPress={handleNameSave}>
                    <Text style={styles.saveIcon}>✓</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => {
                    setTempName(settings.displayName);
                    setEditingName(true);
                  }}
                >
                  <Text style={styles.cardValue}>{settings.displayName}</Text>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Currency */}
            <TouchableOpacity
              style={styles.card}
              onPress={() => setShowCurrencyPicker(true)}
            >
              <Text style={styles.cardLabel}>Currency</Text>
              <View style={styles.cardButton}>
                <View style={styles.currencyDisplay}>
                  <Text style={styles.currencySymbol}>{settings.currencySymbol}</Text>
                  <Text style={styles.cardValue}>{settings.currency}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>

            {/* App Info */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>About</Text>
              <Text style={styles.cardValue}>FunExpense v1.0</Text>
              <Text style={styles.cardSubtext}>Track with joy ✨</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Back Button - Fixed Position */}
      <TouchableOpacity style={styles.fixedBackButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>

      {/* Avatar Picker Modal */}
      <Modal
        visible={showAvatarPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAvatarPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAvatarPicker(false)}
        >
          <View style={styles.avatarModal}>
            <Text style={styles.modalTitle}>Choose Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((avatar) => (
                <TouchableOpacity
                  key={avatar}
                  style={[
                    styles.avatarOption,
                    settings.avatar === avatar && styles.avatarOptionActive,
                  ]}
                  onPress={() => handleAvatarSelect(avatar)}
                >
                  <Text style={styles.avatarOptionEmoji}>{avatar}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Currency Picker Modal */}
      <Modal
        visible={showCurrencyPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyPicker(false)}
      >
        <View style={styles.currencyModalContainer}>
          <TouchableOpacity
            style={styles.currencyOverlay}
            activeOpacity={1}
            onPress={() => setShowCurrencyPicker(false)}
          />
          <View style={styles.currencyModal}>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <ScrollView style={styles.currencyList} showsVerticalScrollIndicator={false}>
              {CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    settings.currency === currency.code && styles.currencyOptionActive,
                  ]}
                  onPress={() => handleCurrencySelect(currency.code, currency.symbol)}
                >
                  <Text style={styles.currencyOptionSymbol}>{currency.symbol}</Text>
                  <View style={styles.currencyOptionText}>
                    <Text style={styles.currencyOptionCode}>{currency.code}</Text>
                    <Text style={styles.currencyOptionName}>{currency.name}</Text>
                  </View>
                  {settings.currency === currency.code && (
                    <Text style={styles.currencyCheck}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingTop: 80,
  },
  simpleHeader: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  fixedBackButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: '#1a1a1a',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarButton: {
    width: 96,
    height: 96,
    backgroundColor: '#E8E5FF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarHint: {
    fontSize: 14,
    color: '#666',
  },
  settingsCards: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  cardButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chevron: {
    fontSize: 24,
    color: '#666',
  },
  nameEditContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  saveButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  currencyDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  avatarModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: 56,
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarOptionActive: {
    backgroundColor: '#E8E5FF',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  avatarOptionEmoji: {
    fontSize: 32,
  },
  currencyModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  currencyOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  currencyModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '70%',
  },
  currencyList: {
    maxHeight: 400,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 8,
  },
  currencyOptionActive: {
    backgroundColor: '#E8E5FF',
    borderWidth: 2,
    borderColor: '#6366f1',
  },
  currencyOptionSymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    width: 40,
  },
  currencyOptionText: {
    flex: 1,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  currencyOptionName: {
    fontSize: 14,
    color: '#666',
  },
  currencyCheck: {
    fontSize: 20,
    color: '#6366f1',
  },
});
