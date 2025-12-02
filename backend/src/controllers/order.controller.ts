import { Request, Response } from "express";

import {
    createOrderService,
    getMyOrdersService,
    updateOrderStatusService
} from "../services/order.service";


// ==========================================
// PLACE ORDER (USER)
// POST /api/orders
// ==========================================
export const placeOrder = async (req: any, res: Response) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;

        if (!shippingAddress) {
            return res.status(400).json({
                message: "Shipping address is required"
            });
        }

        const order = await createOrderService(
            req.user.id,
            shippingAddress,
            paymentMethod || "COD"
        );

        res.status(201).json(order);

    } catch (err: any) {
        console.error("Order error:", err.message);
        res.status(500).json({ error: err.message });
    }
};


// ==========================================
// GET MY ORDERS (USER)
// GET /api/orders/my
// ==========================================
export const myOrders = async (req: any, res: Response) => {
    try {
        const orders = await getMyOrdersService(req.user.id);
        res.json(orders);

    } catch (err: any) {
        console.error("Orders fetch error:", err.message);
        res.status(500).json({ error: err.message });
    }
};


// ==========================================
// UPDATE ORDER STATUS (ADMIN)
// PUT /api/orders/:orderId
// ==========================================
export const updateOrderStatus = async (
    req: Request,
    res: Response
) => {
    try {
        const { status } = req.body;
        const { orderId } = req.params;

        const allowedStatus = [
            "PLACED",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status value"
            });
        }

        const order = await updateOrderStatusService(
            orderId,
            status
        );

        if (!order)
            return res.status(404).json({
                message: "Order not found"
            });

        res.json({
            message: "Status updated successfully",
            order
        });

    } catch (err: any) {
        console.error("Order status update error:", err.message);
        res.status(500).json({ error: err.message });
    }
};
