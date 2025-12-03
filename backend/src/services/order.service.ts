import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";
import { sendEmail } from "../utils/sendEmail";

// ===================================================
// CREATE ORDER FROM CART (USER CHECKOUT + EMAIL NOTIFY)
// ===================================================
export const createOrderService = async (
    userId: string,
    shippingAddress: string,
    paymentMethod: "COD" | "UPI" = "COD"
) => {

    // Fetch user with populated cart → product + subCategory
    const user: any = await User.findById(userId).populate({
        path: "cart.product",
        populate: {
            path: "subCategory",
            select: "offerPercent"
        }
    });

    if (!user)
        throw new Error("User not found");

    if (!user.cart || user.cart.length === 0)
        throw new Error("Cart is empty");

    let totalAmount = 0;
    const orderItems: any[] = [];
    const mailItems: any[] = [];

    // Loop through all cart items
    for (const item of user.cart) {

        const product = item.product;

        if (!product)
            throw new Error("Product not found");

        // Stock check
        if (product.stock < item.quantity) {
            throw new Error(
                `Not enough stock for ${product.name}`
            );
        }

        // Calculate final price after SubCategory offer
        const finalPrice = calculateFinalPrice(
            product.price,
            product.subCategory?.offerPercent
        );

        // Sum total order value
        totalAmount += finalPrice * item.quantity;

        // Add to order items array
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: finalPrice
        });

        // Save item for email template
        mailItems.push({
            name: product.name,
            quantity: item.quantity,
            price: finalPrice
        });

        // Reduce stock
        product.stock -= item.quantity;
        await Product.findByIdAndUpdate(product._id, {
            stock: product.stock
        });
    }

    // Create new ORDER document
    const order = await Order.create({
        user: user._id,
        items: orderItems,
        totalAmount,
        shippingAddress,

        paymentMethod,
        paymentStatus: paymentMethod === "COD"
            ? "PENDING"
            : "PAID",

        status: "PLACED"
    });

    // Clear CART after successful checkout
    user.cart = [];
    await user.save();

    // =====================================
    // SEND EMAIL NOTIFICATION
    // =====================================

    const itemsHTML = mailItems.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>₹${item.price}</td>
            <td>₹${item.quantity * item.price}</td>
        </tr>
    `).join("");

    const emailTemplate = `
        <div style="font-family:sans-serif;">
            <h2>✅ Order Confirmation</h2>

            <p>Hello <b>${user.name}</b>,</p>
            <p>Your order has been placed successfully!</p>

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

            <h3>Grand Total: ₹${totalAmount}</h3>

            <p><b>Shipping Address:</b><br/>
            ${shippingAddress}</p>

            <p>Thanks for shopping with us ❤️</p>
        </div>
    `;

    await sendEmail(
        user.email,
        "🛒 Your Order Confirmation",
        emailTemplate
    );

    return order;
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

    return await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
    );
};
