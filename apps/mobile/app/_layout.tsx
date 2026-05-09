import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/components/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';

// Font Imports
import { PlayfairDisplay_700Bold, PlayfairDisplay_800ExtraBold } from '@expo-google-fonts/playfair-display';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { SpaceGrotesk_600SemiBold } from '@expo-google-fonts/space-grotesk';
import { FlyingCartProvider } from '@/components/ui/FlyingCartProvider';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const initializeAuth = useAuthStore((state) => state.initialize);
  
  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    DMSans_700Bold,
    SpaceGrotesk_600SemiBold,
  });

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={[styles.loading, { backgroundColor: colorScheme === 'dark' ? '#1A1A2E' : '#FFF8E7' }]}>
        <Text style={[styles.loadingText, { color: colorScheme === 'dark' ? '#E2B714' : '#8B4513' }]}>SpiceCart</Text>
      </View>
    );
  }

  return (
    // The style={{ flex: 1 }} is crucial, otherwise the view might collapse to 0 height
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <FlyingCartProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </FlyingCartProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
  }
});
