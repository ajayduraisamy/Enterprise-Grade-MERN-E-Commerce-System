import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading } = useAuth();
    if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!isAdmin) return <Navigate to="/" replace />;
    return <>{children}</>;
}
