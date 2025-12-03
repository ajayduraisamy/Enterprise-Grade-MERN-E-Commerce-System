import { Router } from "express";
import { mockPaymentSuccess } from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

/**
 * POST /api/payments/mock-success
 * Body: { orderId }
 */
router.post("/mock-success", protect, mockPaymentSuccess);

export default router;
