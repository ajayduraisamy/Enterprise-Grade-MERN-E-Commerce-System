import { create } from "zustand";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface UIState {
    theme: "light" | "dark";
    toasts: Toast[];
    sidebarOpen: boolean;
    cartDrawerOpen: boolean;
    setTheme: (theme: "light" | "dark") => void;
    toggleTheme: () => void;
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
    setSidebarOpen: (open: boolean) => void;
    setCartDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    theme: (localStorage.getItem("theme") as "light" | "dark") || "light",
    toasts: [],
    sidebarOpen: false,
    cartDrawerOpen: false,
    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
        set({ theme });
    },
    toggleTheme: () => {
        const newTheme = get().theme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
    },
    showToast: (message, type = "info") => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2);
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4000);
    },
    removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
}));
