import { useToast } from "../../hooks/useToast";
import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from "react-icons/fi";

const icons = {
    success: FiCheckCircle,
    error: FiAlertCircle,
    warning: FiAlertTriangle,
    info: FiInfo,
};

const colors = {
    success: "bg-green-50 border-green-500 text-green-800",
    error: "bg-red-50 border-red-500 text-red-800",
    warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
    info: "bg-blue-50 border-blue-500 text-blue-800",
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
            {toasts.map((toast) => {
                const Icon = icons[toast.type];
                return (
                    <div key={toast.id} className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg animate-slideIn ${colors[toast.type]}`}>
                        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="shrink-0 hover:opacity-70">
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
