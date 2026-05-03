import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  guestMode: boolean;
  login: (user: User) => void;
  logout: () => void;
  setGuestMode: (mode: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      guestMode: false,
      login: (user) => set({ user, isAuthenticated: true, guestMode: false }),
      logout: () => set({ user: null, isAuthenticated: false, guestMode: false }),
      setGuestMode: (mode) => set({ guestMode: mode, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
