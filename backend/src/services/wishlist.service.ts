import mongoose from "mongoose";
import User from "../models/User";
import Product from "../models/Product";

export const addToWishlistService = async (
    userId: string,
    productId: string
) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product id");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const alreadyInWishlist = user.wishlist.some(
        (id) => id.toString() === productId
    );

    if (alreadyInWishlist) {
        throw new Error("Product already in wishlist");
    }

    user.wishlist.push(new mongoose.Types.ObjectId(productId));
    await user.save();
    return user.wishlist;
};

export const removeFromWishlistService = async (
    userId: string,
    productId: string
) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    const filtered = user.wishlist.filter(
        (id) => id.toString() !== productId
    );

    if (filtered.length === user.wishlist.length) {
        throw new Error("Product not in wishlist");
    }

    user.wishlist = filtered;
    await user.save();
    return user.wishlist;
};

export const getWishlistService = async (userId: string) => {
    const user = await User.findById(userId)
        .populate("wishlist")
        .lean();

    if (!user) {
        throw new Error("User not found");
    }

    return user.wishlist;
};
