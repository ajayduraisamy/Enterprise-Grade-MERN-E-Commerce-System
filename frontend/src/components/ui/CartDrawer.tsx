import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiX, FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

export default function CartDrawer() {
    const { items, cartTotal, cartCount, fetchCart, removeItem, updateQty } = useCartStore();
    const { cartDrawerOpen, setCartDrawerOpen } = useUIStore();

    useEffect(() => {
        if (cartDrawerOpen) fetchCart();
    }, [cartDrawerOpen]);

    useEffect(() => {
        if (cartDrawerOpen) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "";
        return () => { document.body.style.overflow = ""; };
    }, [cartDrawerOpen]);

    return (
        <>
            {cartDrawerOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={() => setCartDrawerOpen(false)} />}
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ${cartDrawerOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-bold">Cart ({cartCount})</h2>
                    <button onClick={() => setCartDrawerOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"><FiX className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ height: "calc(100vh - 180px)" }}>
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FiShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500">Your cart is empty</p>
                            <Link to="/shop" onClick={() => setCartDrawerOpen(false)} className="mt-4 text-blue-600 font-semibold hover:underline">Shop Now</Link>
                        </div>
                    ) : items.map((item) => (
                        <div key={item.product?._id} className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shrink-0">
                                {item.product?.images?.[0] ? <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover rounded-lg" /> : <FiShoppingBag className="w-8 h-8 text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <Link to={`/product/${item.product?._id}`} onClick={() => setCartDrawerOpen(false)} className="text-sm font-semibold text-gray-800 dark:text-white hover:text-blue-600 truncate block">{item.product?.name}</Link>
                                <p className="text-sm font-bold text-blue-600 mt-1">Rs.{item.product?.finalPrice || item.product?.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button onClick={() => updateQty(item.product?._id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-200">-</button>
                                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQty(item.product?._id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-200">+</button>
                                    <button onClick={() => removeItem(item.product?._id)} className="ml-auto text-red-400 hover:text-red-600"><FiTrash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {items.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex justify-between mb-3"><span className="font-semibold">Subtotal</span><span className="font-bold text-lg">Rs.{cartTotal}</span></div>
                        <Link to="/checkout" onClick={() => setCartDrawerOpen(false)} className="block w-full py-3 text-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-lg">Checkout</Link>
                    </div>
                )}
            </div>
        </>
    );
}
