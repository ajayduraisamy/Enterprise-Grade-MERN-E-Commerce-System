import { Request, Response } from "express";
import { processMockPayment } from "../services/payment.service";
import { sendEmail } from "../utils/sendEmail";

export const mockPaymentSuccess = async (
    req: Request,
    res: Response
) => {

    try {

        const { orderId } = req.body;

        if (!orderId)
            return res.status(400).json({
                message: "orderId is required"
            });

        const order: any = await processMockPayment(orderId);

        // ✅ Send receipt
        await sendEmail(
            order.user.email,
            "✅ Payment Successful",
            `
                <h2>Payment Received</h2>
                <p>Hello ${order.user.name},</p>
                <p>Your payment for order <b>${order._id}</b> has been completed successfully.</p>

                <p>
                    <b>Payment ID:</b> ${order.paymentId}<br/>
                    <b>Total:</b> ₹${order.totalAmount}
                </p>

                <p>Thank you for shopping with us ❤️</p>
            `
        );

        res.json({
            success: true,
            message: "Payment marked successful",
            order
        });

    } catch (err: any) {

        console.error("PAYMENT ERROR:", err.message);

        res.status(500).json({
            error: err.message
        });

    }
};
