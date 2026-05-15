import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
    createCouponService,
    validateCouponService,
    getAllCouponsService,
    deleteCouponService
} from "../services/coupon.service";

export const createCoupon = async (req: AuthRequest, res: Response) => {
    try {
        const coupon = await createCouponService(req.body);

        res.status(201).json({
            success: true,
            coupon
        });
    } catch (err: any) {
        console.error("CREATE COUPON ERROR:", err.message);

        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Coupon code already exists"
            });
        }

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, orderValue } = req.body;

        if (!code || orderValue === undefined) {
            return res.status(400).json({
                success: false,
                message: "Code and orderValue are required"
            });
        }

        const parsedOrderValue = Number(orderValue);
        if (!Number.isFinite(parsedOrderValue) || parsedOrderValue < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid order value"
            });
        }

        const result = await validateCouponService(code, parsedOrderValue);

        res.json({
            success: true,
            ...result
        });
    } catch (err: any) {
        console.error("VALIDATE COUPON ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const getCoupons = async (req: AuthRequest, res: Response) => {
    try {
        const coupons = await getAllCouponsService();

        res.json({
            success: true,
            coupons
        });
    } catch (err: any) {
        console.error("GET COUPONS ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteCoupon = async (req: AuthRequest, res: Response) => {
    try {
        const deleted = await deleteCouponService(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (err: any) {
        console.error("DELETE COUPON ERROR:", err.message);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
