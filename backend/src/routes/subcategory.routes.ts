import express from "express";

import {
    createSubCategory,
    getSubCategories,
    updateSubCategory,
    deleteSubCategory
} from "../controllers/subcategory.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

// PUBLIC → READ
router.get("/", getSubCategories);

// ADMIN → CRUD
router.post("/", protect, adminOnly, createSubCategory);
router.put("/:id", protect, adminOnly, updateSubCategory);
router.delete("/:id", protect, adminOnly, deleteSubCategory);

export default router;
