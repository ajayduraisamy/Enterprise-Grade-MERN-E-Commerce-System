import Order from "../models/Order";

/* ================================
   DASHBOARD SUMMARY
================================ */
export const getDashboardStats = async () => {

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

    return {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        todayOrders,
        pendingOrders
    };
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
