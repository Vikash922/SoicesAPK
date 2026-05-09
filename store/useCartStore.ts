import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variant?: string;
}

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
  applyCoupon: (code: string) => void;
  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQty: (id, qty) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        });
      },

      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),

      setItems: (items) => set({ items }),

      applyCoupon: (code) => {
        // Mock coupon logic
        if (code === 'SPICE10') {
          set({ couponCode: code, discount: 0.1 });
        } else {
          set({ couponCode: null, discount: 0 });
        }
      },

      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.qty, 0);
      },

      total: () => {
        const sub = get().subtotal();
        const disc = get().discount;
        return sub * (1 - disc);
      },

      itemCount: () => {
        return get().items.reduce((acc, item) => acc + item.qty, 0);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
