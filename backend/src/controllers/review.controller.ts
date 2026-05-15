import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import {
    addReviewService,
    getProductReviewsService,
    deleteReviewService,
    markHelpfulService
} from "../services/review.service";

export const addReview = async (req: AuthRequest, res: Response) => {
    try {
        const { rating, comment } = req.body;
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            });
        }

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required"
            });
        }

        const parsedRating = Number(rating);
        if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5"
            });
        }

        const product = await addReviewService(
            req.user!.id,
            productId,
            parsedRating,
            String(comment).trim()
        );

        res.status(201).json({
            success: true,
            product
        });
    } catch (err: any) {
        console.error("ADD REVIEW ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const getProductReviews = async (req: AuthRequest, res: Response) => {
    try {
        const { productId } = req.params;
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            });
        }

        const result = await getProductReviewsService(productId, page, limit);

        res.json({
            success: true,
            ...result
        });
    } catch (err: any) {
        console.error("GET REVIEWS ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};

export const deleteReview = async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review id"
            });
        }

        await deleteReviewService(
            reviewId,
            req.user!.id,
            req.user?.role
        );

        res.json({
            success: true,
            message: "Review deleted successfully"
        });
    } catch (err: any) {
        console.error("DELETE REVIEW ERROR:", err.message);
        const status = err.message === "Not authorized to delete this review" ? 403 : 400;
        res.status(status).json({
            success: false,
            message: err.message
        });
    }
};

export const markHelpful = async (req: AuthRequest, res: Response) => {
    try {
        const { reviewId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid review id"
            });
        }

        const product = await markHelpfulService(reviewId, req.user!.id);

        res.json({
            success: true,
            product
        });
    } catch (err: any) {
        console.error("MARK HELPFUL ERROR:", err.message);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
