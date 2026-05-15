import { useState, useEffect } from "react";
import { FiPackage, FiChevronDown, FiChevronUp, FiTruck, FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";
import { orderApi } from "../../api";
import { useToast } from "../../hooks/useToast";
import { TableSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Pagination from "../../components/ui/Pagination";

const statusColors: Record<string, string> = {
    PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    CONFIRMED: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    SHIPPED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusIcons: Record<string, any> = {
    PLACED: FiClock, CONFIRMED: FiClock, SHIPPED: FiTruck, DELIVERED: FiCheckCircle, CANCELLED: FiXCircle,
};

const statusFlow = ["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"];

function Timeline({ status }: { status: string }) {
    return (
        <div className="flex items-center gap-1 my-3">
            {statusFlow.map((s, i) => {
                const isActive = statusFlow.indexOf(status) >= i;
                const isCancelled = status === "CANCELLED";
                return (
                    <div key={s} className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCancelled ? "bg-red-100 text-red-600" :
                            isActive ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-600 text-gray-400"
                        }`}>{i + 1}</div>
                        {i < statusFlow.length - 1 && <div className={`flex-1 h-0.5 ${isActive && !isCancelled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-600"}`} />}
                    </div>
                );
            })}
        </div>
    );
}

export default function UserOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const { showToast } = useToast();
    const limit = 5;

    useEffect(() => {
        orderApi.getMy()
            .then((res) => setOrders(res.data))
            .catch(() => showToast("Failed to load orders", "error"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <TableSkeleton rows={5} />;

    if (orders.length === 0) {
        return <EmptyState icon={<FiPackage className="w-10 h-10" />} title="No orders yet" description="Your order history will appear here" actionText="Start Shopping" actionLink="/shop" />;
    }

    const totalPages = Math.ceil(orders.length / limit);
    const paginatedOrders = orders.slice((page - 1) * limit, page * limit);

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Orders ({orders.length})</h1>
            <div className="space-y-4">
                {paginatedOrders.map((order) => {
                    const StatusIcon = statusIcons[order.status] || FiClock;
                    const isExpanded = expandedId === order._id;
                    return (
                        <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <button onClick={() => setExpandedId(isExpanded ? null : order._id)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full ${statusColors[order.status]?.split(" ")[0] || "bg-gray-100"} flex items-center justify-center`}>
                                        <StatusIcon className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-gray-800 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-gray-800 dark:text-white">Rs.{order.totalAmount}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status] || ""}`}>{order.status}</span>
                                    </div>
                                    {isExpanded ? <FiChevronUp className="w-5 h-5 text-gray-400" /> : <FiChevronDown className="w-5 h-5 text-gray-400" />}
                                </div>
                            </button>
                            {isExpanded && (
                                <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
                                    <Timeline status={order.status} />
                                    <div className="space-y-2 mt-3">
                                        {order.items?.map((item: any) => (
                                            <div key={item._id} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                    {item.product?.name?.charAt(0) || "P"}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{item.product?.name || "Product"}</p>
                                                    <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs.{item.price}</p>
                                                </div>
                                                <p className="text-sm font-bold">Rs.{item.quantity * item.price}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4 text-sm">
                                        <div><span className="text-gray-500">Payment:</span> <span className="font-semibold">{order.paymentMethod}</span></div>
                                        <div><span className="text-gray-500">Status:</span> <span className={`font-semibold ${order.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"}`}>{order.paymentStatus}</span></div>
                                        <div className="col-span-2"><span className="text-gray-500">Shipping:</span> <span className="font-semibold">{order.shippingAddress}</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
}
