import express from "express";

import {
    createCoupon,
    validateCoupon,
    getCoupons,
    deleteCoupon
} from "../controllers/coupon.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

router.post("/validate", protect, validateCoupon);
router.post("/", protect, adminOnly, createCoupon);
router.get("/", protect, adminOnly, getCoupons);
router.delete("/:id", protect, adminOnly, deleteCoupon);

export default router;
