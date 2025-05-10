import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => ({
        items: [...state.items, item]
      })),
      removeItem: (itemId) => set((state) => ({
        items: state.items.filter((item) => item._id !== itemId)
      })),
      isInWishlist: (itemId) => {
        const state = get();
        return state.items.some((item) => item._id === itemId);
      },
      clearWishlist: () => set({ items: [] }),
      clearUserWishlist: () => set({ items: [] }) // Add this alias for consistency
    }),
    {
      name: 'wishlist-storage',
      getStorage: () => localStorage
    }
  )
);

export default useWishlistStore;




