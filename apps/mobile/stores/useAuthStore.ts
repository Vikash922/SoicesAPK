import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
  session: Session | null;
  setAuthenticated: (session: Session) => void;
  setGuest: (value: boolean) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isGuest: false,
      user: null,
      session: null,

      setAuthenticated: (session) => set({ 
        isAuthenticated: true, 
        user: session.user, 
        session: session,
        isGuest: false 
      }),

      setGuest: (value) => set({ 
        isGuest: value, 
        isAuthenticated: false, 
        user: null,
        session: null
      }),

      logout: async () => {
        await supabase.auth.signOut();
        set({ isAuthenticated: false, isGuest: false, user: null, session: null });
      },

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          set({ isAuthenticated: true, user: session.user, session: session, isGuest: false });
        }

        // Listen for auth changes
        supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            set({ isAuthenticated: true, user: session.user, session: session, isGuest: false });
          } else {
            // Only clear if not in guest mode
            if (!get().isGuest) {
              set({ isAuthenticated: false, user: null, session: null });
            }
          }
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist the full session object as it contains tokens that might expire
      // or be handled better by Supabase's internal persistence
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        isGuest: state.isGuest,
        user: state.user 
      }),
    }
  )
);
