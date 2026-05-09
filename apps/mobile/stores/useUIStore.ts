import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      onboardingComplete: false,
      setTheme: (theme) => set({ theme }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
