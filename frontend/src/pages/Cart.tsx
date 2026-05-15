import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiTag, FiPercent, FiX, FiChevronRight } from "react-icons/fi";
import { HiOutlineShoppingCart } from "react-icons/hi";
import { couponApi } from "../api";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import EmptyState from "../components/ui/EmptyState";
import Loader from "../components/ui/Loader";

export default function Cart() {
    const navigate = useNavigate();
    const { items, loading, cartCount, fetchCart, updateQty, removeItem } = useCart();
    const { showToast } = useToast();

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [applying, setApplying] = useState(false);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const subtotal = items.reduce((sum, item) => sum + (item.product?.finalPrice || 0) * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 49;
    const discount = appliedCoupon?.discount || 0;
    const tax = Math.round((subtotal - discount) * 0.18 * 100) / 100;
    const grandTotal = Math.max(0, subtotal - discount + shipping + tax);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            showToast("Enter a coupon code", "warning");
            return;
        }
        setApplying(true);
        try {
            const res = await couponApi.validate(couponCode.trim().toUpperCase(), subtotal);
            if (res.data.valid) {
                setAppliedCoupon({ code: res.data.coupon.code, discount: res.data.discount });
                showToast(`Coupon applied! You saved Rs. ${res.data.discount}`, "success");
            } else {
                showToast("Invalid or expired coupon", "error");
            }
        } catch {
            showToast("Failed to apply coupon", "error");
        }
        setApplying(false);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handleUpdateQty = async (productId: string, newQty: number) => {
        if (newQty < 1 || newQty > 99) return;
        await updateQty(productId, newQty);
    };

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        await removeItem(productId);
        setRemovingId(null);
        showToast("Item removed from cart", "info");
    };

    if (loading) return <Loader />;

    if (!items.length) {
        return (
            <EmptyState
                icon={<HiOutlineShoppingCart className="w-10 h-10" />}
                title="Your cart is empty"
                description="Looks like you haven't added anything yet. Browse our products and find something you love!"
                actionText="Browse Products"
                actionLink="/shop"
            />
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Shopping Cart{" "}
                    <span className="text-gray-400 dark:text-gray-500 font-normal">
                        ({cartCount} {cartCount === 1 ? "item" : "items"})
                    </span>
                </h1>
                <nav className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                    <FiChevronRight className="w-3 h-3" />
                    <Link to="/shop" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Shop</Link>
                    <FiChevronRight className="w-3 h-3" />
                    <span className="text-gray-900 dark:text-white font-medium">Cart</span>
                </nav>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">
                <div className="space-y-4">
                    {items.map((item, idx) => (
                        <div key={item.product?._id || idx}>
                            <div className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                <Link
                                    to={`/product/${item.product?._id}`}
                                    className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600"
                                >
                                    {item.product?.images?.[0] ? (
                                        <img
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FiShoppingCart className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                                        </div>
                                    )}
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Link
                                                to={`/product/${item.product?._id}`}
                                                className="text-base font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1"
                                            >
                                                {item.product?.name}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                    Rs. {item.product?.finalPrice?.toLocaleString()}
                                                </span>
                                                {item.product?.price && item.product.price > item.product.finalPrice && (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                                        Rs. {item.product.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Subtotal: Rs. {((item.product?.finalPrice || 0) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => handleUpdateQty(item.product._id, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                                className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <FiMinus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 select-none">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleUpdateQty(item.product._id, item.quantity + 1)}
                                                disabled={item.quantity >= (item.product?.stock || 99)}
                                                className="w-9 h-9 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <FiPlus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition">
                                                Save for Later
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.product._id)}
                                                disabled={removingId === item.product._id}
                                                className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {idx < items.length - 1 && <hr className="border-gray-100 dark:border-gray-700" />}
                        </div>
                    ))}
                </div>

                <div className="lg:sticky lg:top-24">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-5">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Order Summary</h2>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Rs. {subtotal.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                            <span className={`font-semibold ${shipping === 0 ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}>
                                {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                            </span>
                        </div>
                        {subtotal <= 500 && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 -mt-3">
                                Add Rs. {(500 - subtotal).toLocaleString()} more for free shipping
                            </p>
                        )}

                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <FiTag className="w-4 h-4 text-green-600 dark:text-green-400" />
                                        <div>
                                            <span className="text-sm font-semibold text-green-700 dark:text-green-300">{appliedCoupon.code}</span>
                                            <p className="text-xs text-green-600 dark:text-green-400">- Rs. {appliedCoupon.discount.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleRemoveCoupon} className="p-1 text-green-600 dark:text-green-400 hover:text-red-500 transition rounded">
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        <FiPercent className="w-4 h-4 inline mr-1" />
                                        Apply Coupon
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon code"
                                            className="flex-1 px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={applying || !couponCode.trim()}
                                            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        >
                                            {applying ? "..." : "Apply"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                            <span className="font-semibold text-gray-900 dark:text-white">Rs. {tax.toLocaleString()}</span>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                            <div className="flex justify-between">
                                <span className="text-base font-bold text-gray-900 dark:text-white">Grand Total</span>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Rs. {grandTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-base hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                        >
                            Proceed to Checkout
                        </button>

                        <div className="text-center">
                            <Link to="/shop" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition">
                                Continue Shopping &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
