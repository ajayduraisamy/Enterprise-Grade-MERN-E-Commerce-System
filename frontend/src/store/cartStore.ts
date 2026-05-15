import { create } from "zustand";
import { cartApi } from "../api";
import type { ICartItem } from "../types";

interface CartState {
    items: ICartItem[];
    loading: boolean;
    initialized: boolean;
    cartCount: number;
    cartTotal: number;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity?: number) => Promise<boolean>;
    updateQty: (productId: string, quantity: number) => Promise<boolean>;
    removeItem: (productId: string) => Promise<boolean>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    loading: false,
    initialized: false,
    cartCount: 0,
    cartTotal: 0,
    fetchCart: async () => {
        set({ loading: true });
        try {
            const res = await cartApi.get();
            const items = res.data as ICartItem[];
            const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
            const cartTotal = items.reduce((sum, item) => sum + (item.product?.finalPrice || item.product?.price || 0) * item.quantity, 0);
            set({ items, cartCount, cartTotal, loading: false, initialized: true });
        } catch {
            set({ loading: false, initialized: true });
        }
    },
    addToCart: async (productId, quantity = 1) => {
        try {
            await cartApi.add(productId, quantity);
            await get().fetchCart();
            return true;
        } catch { return false; }
    },
    updateQty: async (productId, quantity) => {
        try {
            await cartApi.updateQty(productId, quantity);
            await get().fetchCart();
            return true;
        } catch { return false; }
    },
    removeItem: async (productId) => {
        try {
            await cartApi.remove(productId);
            await get().fetchCart();
            return true;
        } catch { return false; }
    },
    clearCart: () => set({ items: [], cartCount: 0, cartTotal: 0 }),
}));
