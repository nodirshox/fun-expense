import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, User, VerifyOtpResponse } from '@/services/auth.service';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'funexpense_auth_token',
  REFRESH_TOKEN: 'funexpense_refresh_token',
  USER: 'funexpense_user',
  ONBOARDING_COMPLETED: 'funexpense_onboarding_completed',
};

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  hasCompletedOnboarding: boolean;
  sendOtp: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  completeOnboarding: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const [token, userString, onboardingCompleted] = await AsyncStorage.multiGet([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);

      const authToken = token[1];
      const userData = userString[1];
      const onboarding = onboardingCompleted[1];

      if (authToken && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }

      setHasCompletedOnboarding(onboarding === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await authService.sendOtp(email);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      return { success: false, error: errorMessage };
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response: VerifyOtpResponse = await authService.verifyOtp(email, otp);

      await AsyncStorage.multiSet([
        [STORAGE_KEYS.AUTH_TOKEN, response.token.access],
        [STORAGE_KEYS.REFRESH_TOKEN, response.token.refresh],
        [STORAGE_KEYS.USER, JSON.stringify(response.user)],
      ]);

      setIsAuthenticated(true);
      setUser(response.user);

      return { success: true };
    } catch (error: any) {
      let errorMessage = 'Failed to verify OTP. Please try again.';

      if (error.response?.data?.message) {
        const message = error.response.data.message;
        if (message === 'OTP not found or expired') {
          errorMessage = 'OTP has expired. Please request a new one.';
        } else if (message === 'Incorrect OTP') {
          errorMessage = 'Incorrect OTP. Please try again.';
        } else {
          errorMessage = message;
        }
      }

      return { success: false, error: errorMessage };
    }
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
    setHasCompletedOnboarding(true);
  };

  const logout = async () => {
    try {
      // Clear all auth-related data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ONBOARDING_COMPLETED,
      ]);

      // Update state immediately
      setIsAuthenticated(false);
      setUser(null);
      setHasCompletedOnboarding(false);

      console.log('Logout successful - all data cleared');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        user,
        hasCompletedOnboarding,
        sendOtp,
        verifyOtp,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
