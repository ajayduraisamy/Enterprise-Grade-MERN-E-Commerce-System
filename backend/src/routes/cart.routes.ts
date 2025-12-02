import express from "express";
import {
    addToCart,
    updateCartQty,
    removeFromCart,
    getCart
} from "../controllers/cart.controller";

import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:productId", protect, updateCartQty);
router.delete("/:productId", protect, removeFromCart);

export default router;
