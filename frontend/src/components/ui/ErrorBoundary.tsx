import { Component, type ReactNode, type ErrorInfo } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }
    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, info);
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) return this.props.fallback;
            return (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
                        <FiAlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{this.state.error?.message || "An unexpected error occurred"}</p>
                    <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                        Reload Page
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
