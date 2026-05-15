import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { FiCheck, FiChevronRight, FiShoppingBag, FiClock, FiMail, FiHome, FiPackage, FiCreditCard } from "react-icons/fi";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { orderApi } from "../api";
import { useToast } from "../hooks/useToast";
import Loader from "../components/ui/Loader";
import type { IOrder } from "../types";

const STEPS = [
    { num: 1, label: "Shipping" },
    { num: 2, label: "Payment" },
    { num: 3, label: "Confirmation" },
];

export default function OrderSuccess() {
    const { orderId } = useParams<{ orderId: string }>();
    const location = useLocation();
    const { showToast } = useToast();

    const [order, setOrder] = useState<IOrder | null>(location.state?.order || null);
    const [loading, setLoading] = useState(!order);

    useEffect(() => {
        if (order) return;
        const fetchOrder = async () => {
            try {
                const res = await orderApi.getMy();
                const found = res.data.find((o: IOrder) => o._id === orderId);
                if (found) {
                    setOrder(found);
                } else {
                    showToast("Order not found", "error");
                }
            } catch {
                showToast("Failed to load order details", "error");
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId, order, showToast]);

    if (loading) return <Loader />;

    if (!order) {
        return (
            <div className="max-w-3xl mx-auto text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-6">
                    <FiPackage className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Order Not Found</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find an order with that ID.</p>
                <Link
                    to="/dashboard/orders"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-lg"
                >
                    My Orders
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
        CONFIRMED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
        SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
        DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
        CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    };

    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                <FiChevronRight className="w-3 h-3" />
                <Link to="/cart" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Cart</Link>
                <FiChevronRight className="w-3 h-3" />
                <span className="text-gray-900 dark:text-white font-medium">Order Confirmed</span>
            </nav>

            <div className="flex items-center justify-center mb-10">
                {STEPS.map((s, idx) => (
                    <div key={s.num} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    s.num < 3
                                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md"
                                        : "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md"
                                }`}
                            >
                                <FiCheck className="w-5 h-5" />
                            </div>
                            <span className="mt-2 text-xs font-medium text-green-600 dark:text-green-400">{s.label}</span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className="w-16 sm:w-24 h-0.5 mx-2 mt-[-1.25rem] bg-gradient-to-r from-green-400 to-emerald-500" />
                        )}
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                    <HiOutlineBadgeCheck className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Order Confirmed!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Thank you for your purchase. Your order has been placed successfully and is being processed.
                </p>

                <div className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-full">
                    <FiShoppingBag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                        Order ID: <span className="font-mono font-semibold text-gray-900 dark:text-white">{order._id}</span>
                    </span>
                </div>

                <div className="mt-8 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-2xl text-left">
                    <div className="flex items-start gap-3">
                        <FiMail className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Confirmation Email Sent</p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                A confirmation email with your order details has been sent to your registered email address.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiShoppingBag className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Total Amount</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">Rs. {(order.totalAmount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiCreditCard className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Payment</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{order.paymentMethod || "N/A"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <FiClock className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Est. Delivery</p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{estimatedDelivery}</p>
                    </div>
                </div>

                <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}`}>
                    {order.status}
                </div>

                {order.items && order.items.length > 0 && (
                    <div className="mt-8 text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 overflow-hidden shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <FiPackage className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product?.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity} &times; Rs. {(item.price || 0).toLocaleString()}</p>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        Rs. {((item.price || 0) * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/dashboard/orders"
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] shadow-lg"
                    >
                        <FiHome className="w-4 h-4 mr-2" />
                        View Order
                    </Link>
                    <Link
                        to="/shop"
                        className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                    >
                        <FiShoppingBag className="w-4 h-4 mr-2" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}


