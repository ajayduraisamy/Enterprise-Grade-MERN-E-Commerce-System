import express from "express";
//import { register, login } from "../controllers/auth.controller";
import {
    register,
    login,
    verifyOtp,
    forgotPassword,
    resetPassword
} from "../controllers/auth.controller";
import { authLimiter } from "../middleware/rateLimiter";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
