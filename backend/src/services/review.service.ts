import mongoose from "mongoose";
import Product from "../models/Product";
import Order from "../models/Order";

export const addReviewService = async (
    userId: string,
    productId: string,
    rating: number,
    comment: string
) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === userId
    );
    if (alreadyReviewed) {
        throw new Error("You have already reviewed this product");
    }

    const hasPurchased = await Order.findOne({
        user: userId,
        "items.product": productId,
        status: { $ne: "CANCELLED" }
    });
    if (!hasPurchased) {
        throw new Error("You can only review products you have purchased");
    }

    product.reviews.push({
        user: new mongoose.Types.ObjectId(userId),
        rating,
        comment,
        createdAt: new Date(),
        helpful: []
    } as any);

    await product.updateAverageRating();
    return product;
};

export const getProductReviewsService = async (
    productId: string,
    page: number,
    limit: number
) => {
    const product = await Product.findById(productId)
        .select("reviews")
        .populate("reviews.user", "name")
        .lean();

    if (!product) {
        throw new Error("Product not found");
    }

    const reviews = product.reviews || [];
    const total = reviews.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;
    const paginatedReviews = reviews.slice(skip, skip + limit);

    return {
        reviews: paginatedReviews,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
};

export const deleteReviewService = async (
    reviewId: string,
    userId: string,
    userRole?: string
) => {
    const product = await Product.findOne({ "reviews._id": reviewId });
    if (!product) {
        throw new Error("Review not found");
    }

    const review = product.reviews.find(
        (r) => r._id?.toString() === reviewId
    );
    if (!review) {
        throw new Error("Review not found");
    }

    if (review.user.toString() !== userId && userRole !== "admin") {
        throw new Error("Not authorized to delete this review");
    }

    product.reviews = product.reviews.filter(
        (r) => r._id?.toString() !== reviewId
    );
    await product.updateAverageRating();
    return product;
};

export const markHelpfulService = async (
    reviewId: string,
    userId: string
) => {
    const product = await Product.findOne({ "reviews._id": reviewId });
    if (!product) {
        throw new Error("Review not found");
    }

    const review = product.reviews.find(
        (r) => r._id?.toString() === reviewId
    );
    if (!review) {
        throw new Error("Review not found");
    }

    const userIdStr = userId.toString();
    const idx = review.helpful.findIndex(
        (id) => id.toString() === userIdStr
    );

    if (idx === -1) {
        review.helpful.push(new mongoose.Types.ObjectId(userId));
    } else {
        review.helpful.splice(idx, 1);
    }

    await product.save();
    return product;
};
