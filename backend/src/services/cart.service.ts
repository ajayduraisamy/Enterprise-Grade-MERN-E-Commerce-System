import User from "../models/User";
import Product from "../models/Product";

// ADD PRODUCT TO CART
export const addToCartService = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const product = await Product.findById(productId).select("stock isActive");
    if (!product || !product.isActive) throw new Error("Product not available");

    const exist = user.cart.find(
        (item: any) => item.product.toString() === productId
    );

    if (exist) {
        if (product.stock < exist.quantity + quantity) {
            throw new Error("Requested quantity exceeds stock");
        }
        exist.quantity += quantity;
    } else {
        if (product.stock < quantity) {
            throw new Error("Requested quantity exceeds stock");
        }

        user.cart.push({
            product: productId as any,
            quantity
        });
    }

    await user.save();
    return user.cart;
};

// UPDATE CART ITEM QUANTITY
export const updateCartQtyService = async (
    userId: string,
    productId: string,
    quantity: number
) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const item = user.cart.find(
        (i: any) => i.product.toString() === productId
    );
    if (!item) throw new Error("Cart item not found");

    const product = await Product.findById(productId).select("stock isActive");
    if (!product || !product.isActive) throw new Error("Product not available");
    if (product.stock < quantity) throw new Error("Requested quantity exceeds stock");

    item.quantity = quantity;

    await user.save();
    return user.cart;
};

// REMOVE ITEM FROM CART
export const removeFromCartService = async (
    userId: string,
    productId: string
) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.cart = user.cart.filter(
        (item: any) => item.product.toString() !== productId
    );

    await user.save();
    return user.cart;
};

// GET CART PRODUCTS
export const getCartService = async (userId: string) => {
    const user = await User.findById(userId).populate({
        path: "cart.product",
        populate: {
            path: "subCategory",
            select: "offerPercent"
        }
    });

    if (!user) throw new Error("User not found");

    return user.cart;
};
