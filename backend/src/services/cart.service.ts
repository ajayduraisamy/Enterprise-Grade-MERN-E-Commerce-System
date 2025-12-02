import User from "../models/User";

// ADD PRODUCT TO CART
export const addToCartService = async (
    userId: string,
    productId: string,
    quantity: number
) => {

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const exist = user.cart.find(
        (item) => item.product.toString() === productId
    );

    if (exist) {
        exist.quantity += quantity;
    } else {
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
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const item = user.cart.find(
        (i) => i.product.toString() === productId
    );

    if (!item) throw new Error("Cart item not found");

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
        (item) => item.product.toString() !== productId
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
