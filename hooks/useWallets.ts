import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wallet, DEFAULT_WALLET } from '@/types/wallet';
import { apiClient } from '@/services/api-client';

const WALLETS_KEY = 'funexpense_wallets';
const SELECTED_WALLET_KEY = 'funexpense_selected_wallet';

export const useWallets = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [selectedWalletId, setSelectedWalletId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // Load wallets and selected wallet from AsyncStorage
  useEffect(() => {
    loadWallets();
  }, []);

  const loadWallets = async () => {
    try {
      setIsLoading(true);
      const walletsData = await AsyncStorage.getItem(WALLETS_KEY);
      const selectedWalletData = await AsyncStorage.getItem(SELECTED_WALLET_KEY);

      if (walletsData) {
        const parsedWallets = JSON.parse(walletsData);
        setWallets(parsedWallets);

        if (selectedWalletData) {
          setSelectedWalletId(selectedWalletData);
        } else if (parsedWallets.length > 0) {
          // If no wallet is selected, select the first one
          setSelectedWalletId(parsedWallets[0].id);
          await AsyncStorage.setItem(SELECTED_WALLET_KEY, parsedWallets[0].id);
        }
      } else {
        // Initialize with default wallet
        const defaultWallet: Wallet = {
          id: generateId(),
          ...DEFAULT_WALLET,
        };
        setWallets([defaultWallet]);
        setSelectedWalletId(defaultWallet.id);
        await AsyncStorage.setItem(WALLETS_KEY, JSON.stringify([defaultWallet]));
        await AsyncStorage.setItem(SELECTED_WALLET_KEY, defaultWallet.id);
      }
    } catch (error) {
      console.error('Error loading wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWallets = async (updatedWallets: Wallet[]) => {
    try {
      await AsyncStorage.setItem(WALLETS_KEY, JSON.stringify(updatedWallets));
      setWallets(updatedWallets);
    } catch (error) {
      console.error('Error saving wallets:', error);
    }
  };

  const selectWallet = async (walletId: string) => {
    try {
      await AsyncStorage.setItem(SELECTED_WALLET_KEY, walletId);
      setSelectedWalletId(walletId);
    } catch (error) {
      console.error('Error selecting wallet:', error);
    }
  };

  const addWallet = async (wallet: Omit<Wallet, 'id'> & { currencyId?: string }) => {
    try {
      // Send wallet creation request to backend
      const response = await apiClient.post<{ wallet: Wallet }>('/v1/wallets', {
        name: wallet.name,
        emoji: wallet.emoji,
        currencyId: wallet.currencyId,
      });

      const newWallet = response.data.wallet;

      // Save to local storage
      const updatedWallets = [...wallets, newWallet];
      await saveWallets(updatedWallets);

      return newWallet;
    } catch (error) {
      console.error('Error adding wallet:', error);
      throw error;
    }
  };

  const updateWallet = async (walletId: string, updates: Partial<Omit<Wallet, 'id'>>) => {
    try {
      const updatedWallets = wallets.map((wallet) =>
        wallet.id === walletId ? { ...wallet, ...updates } : wallet
      );
      await saveWallets(updatedWallets);
    } catch (error) {
      console.error('Error updating wallet:', error);
    }
  };

  const deleteWallet = async (walletId: string) => {
    try {
      // Don't allow deletion if it's the last wallet
      if (wallets.length <= 1) {
        console.warn('Cannot delete the last wallet');
        return;
      }

      const updatedWallets = wallets.filter((wallet) => wallet.id !== walletId);
      await saveWallets(updatedWallets);

      // If the deleted wallet was selected, select the first available wallet
      if (selectedWalletId === walletId) {
        const newSelectedWallet = updatedWallets[0];
        await selectWallet(newSelectedWallet.id);
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };

  const getSelectedWallet = (): Wallet | undefined => {
    return wallets.find((wallet) => wallet.id === selectedWalletId);
  };

  const generateId = (): string => {
    return `wallet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  return {
    wallets,
    selectedWalletId,
    selectedWallet: getSelectedWallet(),
    isLoading,
    addWallet,
    updateWallet,
    deleteWallet,
    selectWallet,
    getSelectedWallet,
  };
};
