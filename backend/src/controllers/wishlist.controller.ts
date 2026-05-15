import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import {
    addToWishlistService,
    removeFromWishlistService,
    getWishlistService
} from "../services/wishlist.service";

export const addToWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product id is required"
            });
        }

        const wishlist = await addToWishlistService(
            req.user!.id,
            productId
        );

        res.status(201).json({
            success: true,
            wishlist
        });
    } catch (err: any) {
        console.error("ADD WISHLIST ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.params;

        const wishlist = await removeFromWishlistService(
            req.user!.id,
            productId
        );

        res.json({
            success: true,
            wishlist
        });
    } catch (err: any) {
        console.error("REMOVE WISHLIST ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const getWishlist = async (req: AuthRequest, res: Response) => {
    try {
        const wishlist = await getWishlistService(req.user!.id);

        res.json({
            success: true,
            wishlist
        });
    } catch (err: any) {
        console.error("GET WISHLIST ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
