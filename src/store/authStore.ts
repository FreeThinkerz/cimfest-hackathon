import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '@/types/models.types';  

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: ({ user, token }) => {
        localStorage.setItem('accessToken', token);

        set(() => ({
          user,
          accessToken: token,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        localStorage.removeItem('accessToken');

        set(() => ({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }));
      },
    }),

    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

