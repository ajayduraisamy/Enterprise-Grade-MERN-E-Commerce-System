import Order from "../models/Order";
import User from "../models/User";
import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";


// ===================================================
// CREATE ORDER FROM CART (USER CHECKOUT)
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
