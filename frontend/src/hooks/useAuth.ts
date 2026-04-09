import { UserResponseDTO } from "@/api/userService";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: UserResponseDTO | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: UserResponseDTO) => void;
  updateUser: (user: UserResponseDTO) => void;
  signout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      updateUser: (user) =>
        set({
          user,
        }),

      signout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "vibeconnect-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);