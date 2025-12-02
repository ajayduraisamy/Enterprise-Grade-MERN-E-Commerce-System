import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number; // final discounted price
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    shippingAddress: string;

    paymentMethod: "COD" | "UPI";
    paymentStatus: "PENDING" | "PAID";

    status:
    | "PLACED"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";
}

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                },

                price: {
                    type: Number,
                    required: true
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true
        },

        shippingAddress: {
            type: String,
            required: true
        },

        paymentMethod: {
            type: String,
            enum: ["COD", "UPI"],
            default: "COD"
        },

        paymentStatus: {
            type: String,
            enum: ["PENDING", "PAID"],
            default: "PENDING"
        },

        status: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PLACED"
        }
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
