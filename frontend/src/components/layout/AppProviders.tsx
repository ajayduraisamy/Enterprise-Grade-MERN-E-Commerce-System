import { useEffect, type ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

function HydrationWrapper({ children }: { children: ReactNode }) {
    const hydrate = useAuthStore((s) => s.hydrate);
    const fetchCart = useCartStore((s) => s.fetchCart);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const loading = useAuthStore((s) => s.loading);
    const theme = useUIStore((s) => s.theme);

    useEffect(() => { hydrate(); }, []);
    useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); }, [theme]);
    useEffect(() => { if (isAuthenticated) fetchCart(); }, [isAuthenticated]);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    return <>{children}</>;
}

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <HelmetProvider>
            <HydrationWrapper>{children}</HydrationWrapper>
        </HelmetProvider>
    );
}
