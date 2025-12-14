import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useFonts, Nunito_400Regular, Nunito_500Medium, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

function AuthNavigator() {
  const { isLoading, isAuthenticated, hasCompletedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabs = segments[0] === '(tabs)';
    const inProfile = segments[0] === 'profile';
    const inAnalytics = segments[0] === 'analytics';
    const inTransactions = segments[0] === 'transactions';
    const inProtected = inTabs || inProfile || inAnalytics || inTransactions;

    const inOnboarding = segments[0] === 'onboarding';

    // Priority 1: Not completed onboarding -> onboarding screen
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding' as any);
      return;
    }

    // Priority 2: Completed onboarding but not authenticated
    if (hasCompletedOnboarding && !isAuthenticated) {
      // If user is in protected area or still on onboarding, go to login
      if (inProtected || inOnboarding) {
        router.replace('/login' as any);
        return;
      }
      // Otherwise stay on login/verify-otp
      return;
    }

    // Priority 3: Authenticated -> should be in protected area
    if (isAuthenticated && !inProtected) {
      router.replace('/(tabs)');
      return;
    }
  }, [isLoading, isAuthenticated, hasCompletedOnboarding, segments]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="analytics" options={{ headerShown: false }} />
      <Stack.Screen name="transactions" options={{ headerShown: false }} />
    </Stack>
  );
}
