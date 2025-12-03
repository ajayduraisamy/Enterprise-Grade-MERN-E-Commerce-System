import { Router } from "express";
import {
    adminDashboardStats,
    adminGetAllOrders,
    adminOrdersByStatus
} from "../controllers/admin.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";


const router = Router();

router.get("/dashboard", protect, adminOnly, adminDashboardStats);

router.get("/orders", protect, adminOnly, adminGetAllOrders);

router.get("/orders/:status", protect, adminOnly, adminOrdersByStatus);

export default router;
