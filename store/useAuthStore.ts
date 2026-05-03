import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: any | null;
  setAuthenticated: (value: boolean, user?: any) => void;
  setGuest: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      setAuthenticated: (value, user = null) => set({ isAuthenticated: value, user, isGuest: false }),
      setGuest: (value) => set({ isGuest: value, isAuthenticated: false, user: null }),
      logout: () => set({ isAuthenticated: false, isGuest: false, user: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
