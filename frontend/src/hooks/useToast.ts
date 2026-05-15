import { useUIStore } from "../store/uiStore";

export function useToast() {
    const toasts = useUIStore((s) => s.toasts);
    const showToast = useUIStore((s) => s.showToast);
    const removeToast = useUIStore((s) => s.removeToast);
    return { toasts, showToast, removeToast };
}
