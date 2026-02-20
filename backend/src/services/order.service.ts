import mongoose from "mongoose";
import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";
import { sendEmail } from "../utils/sendEmail";
import { clearCacheByPrefix, deleteCache } from "../utils/cache";

const ADMIN_DASHBOARD_CACHE_KEY = "admin:dashboard";

// ===================================================
// CREATE ORDER FROM CART (USER CHECKOUT + EMAIL NOTIFY)
// ===================================================
export const createOrderService = async (
    userId: string,
    shippingAddress: string,
    paymentMethod: "COD" | "UPI" = "COD"
) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user: any = await User.findById(userId)
            .populate({
                path: "cart.product",
                populate: {
                    path: "subCategory",
                    select: "offerPercent"
                }
            })
            .session(session);

        if (!user) throw new Error("User not found");
        if (!user.cart || user.cart.length === 0) throw new Error("Cart is empty");

        let totalAmount = 0;
        const orderItems: any[] = [];
        const mailItems: any[] = [];

        for (const item of user.cart) {
            const product = item.product;
            if (!product?._id) throw new Error("Product not found");

            const finalPrice = calculateFinalPrice(
                product.price,
                product.subCategory?.offerPercent
            );

            const stockUpdated = await Product.findOneAndUpdate(
                { _id: product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );

            if (!stockUpdated) {
                throw new Error(`Not enough stock for ${product.name}`);
            }

            totalAmount += finalPrice * item.quantity;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: finalPrice
            });

            mailItems.push({
                name: product.name,
                quantity: item.quantity,
                price: finalPrice
            });
        }

        const [order] = await Order.create(
            [
                {
                    user: user._id,
                    items: orderItems,
                    totalAmount,
                    shippingAddress,
                    paymentMethod,
                    paymentStatus: "PENDING",
                    status: "PLACED"
                }
            ],
            { session }
        );

        user.cart = [];
        await user.save({ session });

        await session.commitTransaction();

        await Promise.all([
            deleteCache(ADMIN_DASHBOARD_CACHE_KEY),
            clearCacheByPrefix("products:list:")
        ]);

        const itemsHTML = mailItems
            .map(
                (item) => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs.${item.price}</td>
                        <td>Rs.${item.quantity * item.price}</td>
                    </tr>
                `
            )
            .join("");

        const emailTemplate = `
            <div style="font-family:sans-serif;">
                <h2>Order Confirmation</h2>

                <p>Hello <b>${user.name}</b>,</p>
                <p>Your order has been placed successfully.</p>

                <p><b>Order ID:</b> ${order._id}</p>
                <p><b>Status:</b> ${order.status}</p>

                <table border="1" cellpadding="6" cellspacing="0">
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                    ${itemsHTML}
                </table>

                <h3>Grand Total: Rs.${totalAmount}</h3>

                <p><b>Shipping Address:</b><br/>
                ${shippingAddress}</p>
            </div>
        `;

        try {
            await sendEmail(
                user.email,
                "Your Order Confirmation",
                emailTemplate
            );
        } catch (err: any) {
            console.error("ORDER EMAIL ERROR:", err.message);
        }

        return order;
    } catch (err) {
        await session.abortTransaction();
        throw err;
    } finally {
        session.endSession();
    }
};

// ===================================================
// GET ORDERS OF LOGGED-IN USER
// ===================================================
export const getMyOrdersService = async (
    userId: string
) => {
    return await Order.find({ user: userId })
        .populate("items.product", "name images price")
        .sort({ createdAt: -1 });
};

// ===================================================
// UPDATE ORDER STATUS (ADMIN)
// ===================================================
export const updateOrderStatusService = async (
    orderId: string,
    status:
        | "PLACED"
        | "CONFIRMED"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
) => {
    const order = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );

    await deleteCache(ADMIN_DASHBOARD_CACHE_KEY);

    return order;
};
