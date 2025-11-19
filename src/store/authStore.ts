import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { User, UserRole } from "@/types/models.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (data: { user: User; token: string }) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
  isMusician: () => boolean;
  isLabel: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: ({ user, token }) => {
        localStorage.setItem("accessToken", token);
        set(() => ({
          user,
          accessToken: token,
          isAuthenticated: true,
        }));
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set(() => ({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }));
      },

      hasRole: (role: UserRole) => {
        const { user } = get();
        return user?.roles[0] === role;
      },

      isMusician: () => {
        const { user } = get();
        return user?.roles[0] === "artist";
      },

      isLabel: () => {
        const { user } = get();
        return user?.roles[0] === "sponsor";
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
