import express from "express";

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);

// ADMIN
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
