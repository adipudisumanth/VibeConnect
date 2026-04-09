import { UserResponseDTO } from "@/api/userService";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  user: UserResponseDTO | null;
  isAuthenticated: boolean;
  // Actions
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

      // Call this after successful login or registration
      setAuth: (token, user) =>
        set({
          token,
          user,
          isAuthenticated: true,
        }),

      // Call this when updating the profile
      updateUser: (user) =>
        set({
          user,
        }),

      // Clears everything from state and localStorage
      signout: () =>
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "vibeconnect-auth", // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
