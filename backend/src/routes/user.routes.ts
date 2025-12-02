import express from "express";

import {
    getUsers,
    getUser,
    updateUserRole,
    deleteUser
} from "../controllers/user.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

// ADMIN ONLY ROUTES
router.get("/", protect, adminOnly, getUsers);
router.get("/:id", protect, adminOnly, getUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
