import { useWishlistStore } from "../store/wishlistStore";

export function useWishlist() {
    const items = useWishlistStore((s) => s.items);
    const loading = useWishlistStore((s) => s.loading);
    const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
    const addToWishlist = useWishlistStore((s) => s.addToWishlist);
    const removeFromWishlist = useWishlistStore((s) => s.removeFromWishlist);
    const isInWishlist = useWishlistStore((s) => s.isInWishlist);
    return { items, loading, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist };
}
