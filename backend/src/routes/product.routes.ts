import express from "express";

import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller";

import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";
import { uploadProductImages } from "../middleware/upload.middleware";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);

// ADMIN
router.post("/", protect, adminOnly, uploadProductImages, createProduct);
router.put("/:id", protect, adminOnly, uploadProductImages, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
