import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;

    category: mongoose.Types.ObjectId;
    subCategory: mongoose.Types.ObjectId;

    stock: number;
    images: string[];
    isActive: boolean;
}

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
        }
    },
    { timestamps: true }
);


ProductSchema.index({ name: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ subCategory: 1 });

export default mongoose.model<IProduct>("Product", ProductSchema);
