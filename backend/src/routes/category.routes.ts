import express from "express";
import {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
} from "../controllers/category.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

// PUBLIC → READ
router.get("/", getCategories);

// ADMIN → CREATE
router.post("/", protect, adminOnly, createCategory);

// ADMIN → UPDATE
router.put("/:id", protect, adminOnly, updateCategory);

// ADMIN → DELETE
router.delete("/:id", protect, adminOnly, deleteCategory);

export default router;
