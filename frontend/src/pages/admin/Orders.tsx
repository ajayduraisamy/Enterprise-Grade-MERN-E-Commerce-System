import { useState, useEffect, useMemo } from "react";
import { FiChevronDown, FiChevronUp, FiSearch } from "react-icons/fi";
import { adminApi, orderApi } from "../../api";
import type { IOrder } from "../../types";
import { useToast } from "../../hooks/useToast";
import { TableSkeleton } from "../../components/ui/Skeleton";

const statuses = ["ALL", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusColors: Record<string, string> = {
    PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    CONFIRMED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    SHIPPED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const paymentColors: Record<string, string> = {
    PAID: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Orders() {
    const { showToast } = useToast();
    const [orders, setOrders] = useState<IOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [search, setSearch] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchOrders = async (status?: string) => {
        setLoading(true);
        try {
            const res = status && status !== "ALL" ? await adminApi.getOrdersByStatus(status) : await adminApi.getOrders();
            setOrders(res.data);
        } catch {
            showToast("Failed to load orders", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(activeTab); }, [activeTab]);

    const filtered = useMemo(() => {
        if (!search.trim()) return orders;
        return orders.filter((o) => o._id.toLowerCase().includes(search.toLowerCase()));
    }, [orders, search]);

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            const res = await orderApi.updateStatus(orderId, newStatus);
            setOrders((prev) => prev.map((o) => (o._id === orderId ? res.data.order : o)));
            showToast(`Order status updated to ${newStatus}`, "success");
        } catch {
            showToast("Failed to update status", "error");
        }
    };

    const getCustomerInfo = (order: IOrder) => {
        if (typeof order.user === "object") return { name: order.user.name, email: order.user.email };
        return { name: order.user, email: "" };
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>

            <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                    <button
                        key={s}
                        onClick={() => { setActiveTab(s); setExpandedId(null); }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeTab === s ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                    >
                        {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by Order ID..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6"><TableSkeleton rows={5} /></div>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-12">No orders found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Order ID</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Customer</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Items</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Total</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Payment</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((order) => {
                                    const customer = getCustomerInfo(order);
                                    const isExpanded = expandedId === order._id;
                                    return (
                                        <>
                                            <tr
                                                key={order._id}
                                                onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                                className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors cursor-pointer"
                                            >
                                                <td className="p-4 font-mono text-xs text-gray-900 dark:text-white flex items-center gap-2">
                                                    {isExpanded ? <FiChevronUp className="w-4 h-4 text-gray-400" /> : <FiChevronDown className="w-4 h-4 text-gray-400" />}
                                                    #{order._id.slice(-8)}
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-gray-900 dark:text-white font-medium">{customer.name}</p>
                                                    {customer.email && <p className="text-xs text-gray-500 dark:text-gray-400">{customer.email}</p>}
                                                </td>
                                                <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</td>
                                                <td className="p-4 text-gray-700 dark:text-gray-300">{order.items?.length || 0}</td>
                                                <td className="p-4 font-semibold text-gray-900 dark:text-white">₹{order.totalAmount.toLocaleString("en-IN")}</td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus] || "bg-gray-100 text-gray-700"}`}>{order.paymentStatus}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>{order.status}</span>
                                                </td>
                                                <td className="p-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateStatus(order._id, e.target.value)}
                                                        className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer"
                                                    >
                                                        {statuses.filter((s) => s !== "ALL").map((s) => (
                                                            <option key={s} value={s}>{s}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                            {isExpanded && order.items && (
                                                <tr key={`${order._id}-items`}>
                                                    <td colSpan={8} className="p-4 bg-gray-50 dark:bg-gray-800/50">
                                                        <div className="space-y-2">
                                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Items</p>
                                                            {order.items.map((item) => (
                                                                <div key={item._id} className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-700/50">
                                                                    {item.product?.images?.[0] && (
                                                                        <img src={item.product.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product?.name || "Product"}</p>
                                                                        <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
                                                                </div>
                                                            ))}
                                                            <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                                                <p className="text-xs text-gray-500">Shipping: {order.shippingAddress}</p>
                                                                {order.paymentId && <p className="text-xs text-gray-500">Payment ID: {order.paymentId}</p>}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
