import { useAuthStore } from "../store/authStore";

export function useAuth() {
    const user = useAuthStore((s) => s.user);
    const token = useAuthStore((s) => s.token);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isAdmin = useAuthStore((s) => s.isAdmin);
    const loading = useAuthStore((s) => s.loading);
    const login = useAuthStore((s) => s.login);
    const logout = useAuthStore((s) => s.logout);
    return { user, token, isAuthenticated, isAdmin, login, logout, loading };
}
