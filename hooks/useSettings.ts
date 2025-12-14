import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Settings } from '@/types/transaction';

const STORAGE_KEY = 'funexpense_settings';

const defaultSettings: Settings = {
  displayName: 'Friend',
  avatar: '😊',
};

export const AVATARS = ['😊', '😎', '🤩', '🥳', '😇', '🤓', '🦊', '🐱', '🐶', '🦄', '🌟', '💎'];

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const reloadSettings = async () => {
    await loadSettings();
  };

  return {
    settings,
    updateSettings,
    reloadSettings,
    loading,
    AVATARS,
  };
};
