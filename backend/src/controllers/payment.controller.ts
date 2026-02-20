import { Request, Response } from "express";
import mongoose from "mongoose";
import { processMockPayment } from "../services/payment.service";
import { sendEmail } from "../utils/sendEmail";

export const mockPaymentSuccess = async (
    req: Request,
    res: Response
) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                message: "orderId is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(String(orderId))) {
            return res.status(400).json({
                message: "Invalid order id"
            });
        }

        const order: any = await processMockPayment(orderId);

        try {
            await sendEmail(
                order.user.email,
                "Payment Successful",
                `
                    <h2>Payment Received</h2>
                    <p>Hello ${order.user.name},</p>
                    <p>Your payment for order <b>${order._id}</b> has been completed successfully.</p>

                    <p>
                        <b>Payment ID:</b> ${order.paymentId}<br/>
                        <b>Total:</b> Rs.${order.totalAmount}
                    </p>
                `
            );
        } catch (err: any) {
            console.error("PAYMENT RECEIPT EMAIL ERROR:", err.message);
        }

        return res.json({
            success: true,
            message: "Payment marked successful",
            order
        });
    } catch (err: any) {
        console.error("PAYMENT ERROR:", err.message);

        if (err.message === "Order not found") {
            return res.status(404).json({ error: err.message });
        }

        if (err.message === "Cannot process payment for cancelled order") {
            return res.status(400).json({ error: err.message });
        }

        return res.status(500).json({
            error: err.message
        });
    }
};
