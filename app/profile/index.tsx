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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useSettings, AVATARS, CURRENCIES } from '@/hooks/useSettings';
import { useAuth } from '@/contexts/AuthContext';
import { Shadows } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { settings, updateSettings } = useSettings();
  const { logout, user } = useAuth();
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

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/onboarding');
            } catch (error) {
              console.error('Logout failed:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
              <Text style={styles.headerTitle}>Profile</Text>
              <Text style={styles.headerSubtitle}>Customize your experience</Text>
            </View>
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

          {/* User Info */}
          {user && (
            <View style={[styles.card, { marginBottom: 12 }]}>
              <Text style={styles.cardLabel}>Email</Text>
              <Text style={styles.cardValue}>{user.email}</Text>
            </View>
          )}

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

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>FunExpense 1.0</Text>
          </View>
        </View>
      </ScrollView>

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
    ...Shadows.card,
  },
  avatarEmoji: {
    fontSize: 48,
  },
  avatarHint: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
  settingsCards: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    ...Shadows.soft,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Nunito_500Medium',
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
    fontFamily: 'Nunito_600SemiBold',
  },
  cardSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_400Regular',
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
    fontFamily: 'Nunito_700Bold',
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
    fontFamily: 'Nunito_700Bold',
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
    fontFamily: 'Nunito_700Bold',
  },
  currencyOptionText: {
    flex: 1,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    fontFamily: 'Nunito_600SemiBold',
  },
  currencyOptionName: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Nunito_400Regular',
  },
  currencyCheck: {
    fontSize: 20,
    color: '#6366f1',
  },
  logoutCard: {
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0E0',
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: 'Nunito_600SemiBold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'Nunito_400Regular',
  },
});
