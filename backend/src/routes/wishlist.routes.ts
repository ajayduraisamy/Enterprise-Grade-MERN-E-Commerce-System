import express from "express";

import {
    addToWishlist,
    removeFromWishlist,
    getWishlist
} from "../controllers/wishlist.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, addToWishlist);
router.delete("/:productId", protect, removeFromWishlist);
router.get("/", protect, getWishlist);

export default router;
