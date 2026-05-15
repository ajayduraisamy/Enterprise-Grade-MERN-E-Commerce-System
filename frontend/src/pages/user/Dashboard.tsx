import { useState, useEffect } from "react";
import { FiShoppingBag, FiHeart, FiMapPin, FiUser, FiPackage, FiDollarSign, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { orderApi, wishlistApi } from "../../api";
import { Skeleton } from "../../components/ui/Skeleton";

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ orders: 0, wishlist: 0, spent: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            orderApi.getMy(),
            wishlistApi.get()
        ]).then(([ordersRes, wishlistRes]) => {
            const orders = ordersRes.data;
            const totalSpent = orders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
            setStats({ orders: orders.length, wishlist: wishlistRes.data.length, spent: totalSpent });
            setRecentOrders(orders.slice(0, 5));
        }).catch(() => {}).finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="space-y-6">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>;

    const statCards = [
        { label: "Total Orders", value: stats.orders, icon: FiPackage, color: "from-blue-500 to-purple-500", link: "/dashboard/orders" },
        { label: "Total Spent", value: `Rs.${stats.spent}`, icon: FiDollarSign, color: "from-purple-500 to-pink-500", link: "/dashboard/orders" },
        { label: "Wishlist", value: stats.wishlist, icon: FiHeart, color: "from-pink-500 to-rose-500", link: "/dashboard/wishlist" },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user?.name?.split(" ")[0] || "User"}!</h1>
                <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {statCards.map((card) => (
                    <Link key={card.label} to={card.link} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.color} flex items-center justify-center text-white`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition">{card.value}</p>
                    </Link>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Recent Orders</h2>
                    <Link to="/dashboard/orders" className="text-sm text-blue-600 font-semibold hover:underline">View All</Link>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="text-center py-8">
                        <FiShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">No orders yet</p>
                        <Link to="/shop" className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition shadow-md">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order: any) => (
                            <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">Rs.{order.totalAmount}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                        order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                                        order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                        order.status === "SHIPPED" ? "bg-orange-100 text-orange-700" :
                                        "bg-blue-100 text-blue-700"
                                    }`}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
