import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { syncService } from '@/lib/syncService';
import { useCartStore } from './useCartStore';
import { useWishlistStore } from './useWishlistStore';

interface AuthState {
  isAuthenticated: boolean;
  isGuest: boolean;
  user: User | null;
  session: Session | null;
  setAuthenticated: (session: Session) => Promise<void>;
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

      setAuthenticated: async (session) => {
        const userId = session.user.id;
        
        // 1. Sync local data to cloud (Merge)
        const localCart = useCartStore.getState().items;
        const localWishlist = useWishlistStore.getState().items;
        
        try {
          await Promise.all([
            syncService.syncCart(userId, localCart),
            syncService.syncWishlist(userId, localWishlist)
          ]);

          // 2. Fetch fresh consolidated data from cloud
          const [cloudCart, cloudWishlist] = await Promise.all([
            syncService.fetchCloudCart(userId),
            syncService.fetchCloudWishlist(userId)
          ]);

          // 3. Update stores
          useCartStore.getState().setItems(cloudCart);
          useWishlistStore.getState().setItems(cloudWishlist);
        } catch (error) {
          console.error('Error syncing cloud data:', error);
        }

        set({ 
          isAuthenticated: true, 
          user: session.user, 
          session: session,
          isGuest: false 
        });
      },

      setGuest: (value) => set({ 
        isGuest: value, 
        isAuthenticated: false, 
        user: null,
        session: null
      }),

      logout: async () => {
        await supabase.auth.signOut();
        useCartStore.getState().clearCart();
        useWishlistStore.getState().clearWishlist();
        set({ isAuthenticated: false, isGuest: false, user: null, session: null });
      },

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Trigger a silent sync/fetch on app open if already logged in
          const userId = session.user.id;
          Promise.all([
            syncService.fetchCloudCart(userId),
            syncService.fetchCloudWishlist(userId)
          ]).then(([cart, wishlist]) => {
            useCartStore.getState().setItems(cart);
            useWishlistStore.getState().setItems(wishlist);
          }).catch(console.error);

          set({ isAuthenticated: true, user: session.user, session: session, isGuest: false });
        }

        // Listen for auth changes (Crucial for email link auto-login)
        supabase.auth.onAuthStateChange(async (event, session) => {
          if (session) {
            // If we just got a session (e.g., from an email link)
            const userId = session.user.id;
            
            // Perform sync in the background
            syncService.fetchCloudCart(userId).then(cart => useCartStore.getState().setItems(cart));
            syncService.fetchCloudWishlist(userId).then(wish => useWishlistStore.getState().setItems(wish));

            set({ isAuthenticated: true, user: session.user, session: session, isGuest: false });
          } else if (event === 'SIGNED_OUT') {
            set({ isAuthenticated: false, user: null, session: null });
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
