import express from "express";

import {
    addReview,
    getProductReviews,
    deleteReview,
    markHelpful
} from "../controllers/review.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/:productId", protect, addReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", protect, deleteReview);
router.put("/:reviewId/helpful", protect, markHelpful);

export default router;
