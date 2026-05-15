import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
    code: string;
    discountPercent: number;
    minOrderValue: number;
    maxDiscount: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

const CouponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        discountPercent: {
            type: Number,
            required: true,
            min: 1,
            max: 100
        },

        minOrderValue: {
            type: Number,
            required: true,
            min: 0
        },

        maxDiscount: {
            type: Number,
            required: true,
            min: 0
        },

        validFrom: {
            type: Date,
            required: true
        },

        validUntil: {
            type: Date,
            required: true
        },

        usageLimit: {
            type: Number,
            required: true,
            min: 1
        },

        usedCount: {
            type: Number,
            default: 0,
            min: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

CouponSchema.index({ code: 1 });

export default mongoose.model<ICoupon>("Coupon", CouponSchema);
