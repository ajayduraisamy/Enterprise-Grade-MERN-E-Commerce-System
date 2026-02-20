import Order from "../models/Order";
import { deleteCache } from "../utils/cache";

const ADMIN_DASHBOARD_CACHE_KEY = "admin:dashboard";

/**
 * Simulates payment gateway success
 */
export const processMockPayment = async (orderId: string) => {

    const order: any = await Order
        .findById(orderId)
        .populate("user", "name email");

    if (!order)
        throw new Error("Order not found");

    if (order.status === "CANCELLED") {
        throw new Error("Cannot process payment for cancelled order");
    }

    if (order.paymentStatus === "PAID")
        return order; // idempotent

    order.paymentStatus = "PAID";
    order.paymentId = "MOCK_" + Date.now();
    order.paidAt = new Date();

    const paidOrder = await order.save();
    await deleteCache(ADMIN_DASHBOARD_CACHE_KEY);

    return paidOrder;
};
