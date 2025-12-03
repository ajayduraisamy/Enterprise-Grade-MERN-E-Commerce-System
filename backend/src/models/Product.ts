import mongoose, { Schema, Document } from "mongoose";

/* ============================
   REVIEW TYPE
============================ */
export interface IReview {
    user: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

/* ============================
   PRODUCT TYPE
============================ */
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;

    category: mongoose.Types.ObjectId;
    subCategory: mongoose.Types.ObjectId;

    stock: number;
    images: string[];
    isActive: boolean;

    reviews: IReview[];
    averageRating: number;
    reviewCount: number;

    updateAverageRating(): Promise<void>;
}

/* ============================
   REVIEW SCHEMA
============================ */
const ReviewSchema = new Schema<IReview>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        comment: {
            type: String,
            required: true,
            trim: true
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

/* ============================
   PRODUCT SCHEMA
============================ */
const ProductSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true,
            min: 1
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        subCategory: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
            required: true
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        images: [
            {
                type: String,
                required: true
            }
        ],

        isActive: {
            type: Boolean,
            default: true
        },

        reviews: [ReviewSchema],

        reviewCount: {
            type: Number,
            default: 0
        },

        averageRating: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

/* ============================
   INDEXES
============================ */

ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subCategory: 1 });

/* TEXT SEARCH INDEX */
ProductSchema.index({
    name: "text",
    description: "text"
});

/* ONE REVIEW PER USER PER PRODUCT */
ProductSchema.index(
    { _id: 1, "reviews.user": 1 },
    { unique: true, sparse: true }
);

/* ============================
   METHODS
============================ */

ProductSchema.methods.updateAverageRating = async function (): Promise<void> {
    const product = this as IProduct;

    if (!product.reviews || product.reviews.length === 0) {
        product.reviewCount = 0;
        product.averageRating = 0;
        await product.save();
        return;
    }

    const total = product.reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    product.reviewCount = product.reviews.length;
    product.averageRating = Number(
        (total / product.reviewCount).toFixed(2)
    );

    await product.save();
};

/* ============================
   EXPORT MODEL
============================ */

export default mongoose.model<IProduct>("Product", ProductSchema);
