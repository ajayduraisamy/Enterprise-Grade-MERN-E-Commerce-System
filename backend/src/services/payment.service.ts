import Order from "../models/Order";

/**
 * Simulates payment gateway success
 */
export const processMockPayment = async (orderId: string) => {

    const order: any = await Order
        .findById(orderId)
        .populate("user", "name email");

    if (!order)
        throw new Error("Order not found");

    if (order.paymentStatus === "PAID")
        return order; // idempotent

    order.paymentStatus = "PAID";
    order.paymentId = "MOCK_" + Date.now();
    order.paidAt = new Date();

    return await order.save();
};
