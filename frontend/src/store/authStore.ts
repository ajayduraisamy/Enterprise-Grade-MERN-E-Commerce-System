import { create } from "zustand";
import type { IUser } from "../types";

interface AuthState {
    user: IUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    loading: boolean;
    login: (user: IUser, token: string) => void;
    logout: () => void;
    setUser: (user: IUser) => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    login: (user, token) => {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
        set({ user, token, isAuthenticated: true, isAdmin: user.role === "admin" });
    },
    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
        window.location.href = "/login";
    },
    setUser: (user) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user, isAdmin: user.role === "admin" });
    },
    hydrate: () => {
        try {
            const savedUser = localStorage.getItem("user");
            const savedToken = localStorage.getItem("token");
            if (savedUser && savedToken) {
                const user = JSON.parse(savedUser);
                set({ user, token: savedToken, isAuthenticated: true, isAdmin: user.role === "admin", loading: false });
            } else {
                set({ loading: false });
            }
        } catch {
            set({ loading: false });
        }
    },
}));
