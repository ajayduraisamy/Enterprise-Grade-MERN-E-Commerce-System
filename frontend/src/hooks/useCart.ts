import { useCartStore } from "../store/cartStore";

export function useCart() {
    const items = useCartStore((s) => s.items);
    const loading = useCartStore((s) => s.loading);
    const cartCount = useCartStore((s) => s.cartCount);
    const cartTotal = useCartStore((s) => s.cartTotal);
    const fetchCart = useCartStore((s) => s.fetchCart);
    const addToCart = useCartStore((s) => s.addToCart);
    const updateQty = useCartStore((s) => s.updateQty);
    const removeItem = useCartStore((s) => s.removeItem);
    return { items, loading, cartCount, cartTotal, fetchCart, addToCart, updateQty, removeItem };
}
