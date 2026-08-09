import { User } from "@/features/user/types/user.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  tempToken: string | null;
  user: User | null;
  _hasHydrated: boolean;
  setAuth: (accessToken: string, tempToken: string, user: AuthState["user"]) => void;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      tempToken: null,
      user: null,
      _hasHydrated: false,
      setAuth: (accessToken, tempToken, user) => set({ accessToken, tempToken, user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setUser: (user) => set((state) => ({ ...state, user })), // ← thêm cái này
      logout: () => set({ accessToken: null, tempToken: null, user: null }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);

export default useAuthStore;
