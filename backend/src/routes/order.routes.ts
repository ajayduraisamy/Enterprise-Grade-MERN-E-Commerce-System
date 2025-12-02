import express from "express";

import {
    placeOrder,
    myOrders,
    updateOrderStatus
} from "../controllers/order.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

// USER
router.post("/", protect, placeOrder);
router.get("/my", protect, myOrders);

// ADMIN
router.put("/:orderId", protect, adminOnly, updateOrderStatus);

export default router;
