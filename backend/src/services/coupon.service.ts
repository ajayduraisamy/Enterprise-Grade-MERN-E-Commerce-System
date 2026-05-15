import Coupon from "../models/Coupon";

export const createCouponService = async (data: Record<string, unknown>) => {
    const coupon = await Coupon.create(data);
    return coupon;
};

export const validateCouponService = async (
    code: string,
    orderValue: number
) => {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
        throw new Error("Coupon not found");
    }

    if (!coupon.isActive) {
        throw new Error("Coupon is no longer active");
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
        throw new Error("Coupon has expired or is not yet valid");
    }

    if (orderValue < coupon.minOrderValue) {
        throw new Error(
            `Minimum order value of ${coupon.minOrderValue} required`
        );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        throw new Error("Coupon usage limit reached");
    }

    const discount = Math.min(
        Math.round((orderValue * coupon.discountPercent) / 100),
        coupon.maxDiscount
    );

    return {
        coupon: {
            _id: coupon._id,
            code: coupon.code,
            discountPercent: coupon.discountPercent,
            maxDiscount: coupon.maxDiscount,
            minOrderValue: coupon.minOrderValue
        },
        discount
    };
};

export const getAllCouponsService = async () => {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return coupons;
};

export const deleteCouponService = async (id: string) => {
    const deleted = await Coupon.findByIdAndDelete(id);
    return deleted;
};
