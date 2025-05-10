import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useWishlistStore from './wishlistStore';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (userData) => set({
        user: userData,
        token: userData.token
      }),
      logout: () => {
        useWishlistStore.getState().clearWishlist(); // Updated to use clearWishlist
        localStorage.removeItem('token');
        set({ user: null, token: null });

        // Redirect to login page after logout
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;


