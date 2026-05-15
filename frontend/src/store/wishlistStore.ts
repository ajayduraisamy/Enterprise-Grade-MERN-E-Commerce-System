import { create } from "zustand";
import { wishlistApi } from "../api";
import type { IProduct } from "../types";

interface WishlistState {
    items: IProduct[];
    loading: boolean;
    fetchWishlist: () => Promise<void>;
    addToWishlist: (productId: string) => Promise<boolean>;
    removeFromWishlist: (productId: string) => Promise<boolean>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    items: [],
    loading: false,
    fetchWishlist: async () => {
        set({ loading: true });
        try {
            const res = await wishlistApi.get();
            set({ items: res.data, loading: false });
        } catch { set({ loading: false }); }
    },
    addToWishlist: async (productId) => {
        try {
            await wishlistApi.add(productId);
            await get().fetchWishlist();
            return true;
        } catch { return false; }
    },
    removeFromWishlist: async (productId) => {
        try {
            await wishlistApi.remove(productId);
            await get().fetchWishlist();
            return true;
        } catch { return false; }
    },
    isInWishlist: (productId) => get().items.some((item) => item._id === productId),
}));
