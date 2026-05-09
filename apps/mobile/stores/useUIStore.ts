import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UIState {
  theme: 'light' | 'dark' | 'system';
  onboardingComplete: boolean;
  activeTab: string;
  isSearchOpen: boolean;
  toast: { type: 'success' | 'error' | 'info'; message: string } | null;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setOnboardingComplete: (complete: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSearchOpen: (open: boolean) => void;
  showToast: (type: 'success' | 'error' | 'info', message: string) => void;
  clearToast: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      onboardingComplete: false,
      activeTab: 'home',
      isSearchOpen: false,
      toast: null,
      setTheme: (theme) => set({ theme }),
      setOnboardingComplete: (onboardingComplete) => set({ onboardingComplete }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSearchOpen: (isSearchOpen) => set({ isSearchOpen }),
      showToast: (type, message) => set({ toast: { type, message } }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
