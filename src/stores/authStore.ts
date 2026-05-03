import { User } from "@/types/response/authResponse.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  user: User | null;
  _hasHydrated: boolean;
  setAuth: (token: string, user: AuthState["user"]) => void;
  setHasHydrated: (state: boolean) => void;
  setUser: (user: AuthState["user"]) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      _hasHydrated: false,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setUser: (user) => set((state) => ({ ...state, user })), // ← thêm cái này
      logout: () => set({ accessToken: null, user: null }),
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
