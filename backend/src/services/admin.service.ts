import Order from "../models/Order";
import { getCache, setCache } from "../utils/cache";

const ADMIN_DASHBOARD_CACHE_KEY = "admin:dashboard";
const ADMIN_DASHBOARD_CACHE_TTL = 60 * 2;

/* ================================
   DASHBOARD SUMMARY
================================ */
export const getDashboardStats = async () => {
    const cached = await getCache<any>(ADMIN_DASHBOARD_CACHE_KEY);
    if (cached) return cached;

    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        {
            $group: {
                _id: null,
                total: { $sum: "$totalAmount" }
            }
        }
    ]);

    const todayOrders = await Order.countDocuments({
        createdAt: {
            $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
    });

    const pendingOrders = await Order.countDocuments({
        status: "PLACED"
    });

    const stats = {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        pendingOrders
    };

    await setCache(
        ADMIN_DASHBOARD_CACHE_KEY,
        stats,
        ADMIN_DASHBOARD_CACHE_TTL
    );

    return stats;
};


/* ================================
   ADMIN GET ALL ORDERS
================================ */
export const getAllOrdersService = async () => {

    return await Order
        .find()
        .populate("user", "name email")
        .populate("items.product", "name images price")
        .sort({ createdAt: -1 });
};


/* ================================
   FILTER ORDERS BY STATUS
================================ */
export const getOrdersByStatusService = async (
    status: string
) => {

    return await Order
        .find({ status })
        .populate("user", "name email")
        .populate("items.product", "name images price")
        .sort({ createdAt: -1 });
};
