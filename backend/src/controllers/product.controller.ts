import { Request, Response } from "express";
import mongoose from "mongoose";

import {
    createProductService,
    getProductsService,
    updateProductService,
    deleteProductService
} from "../services/product.service";


/* ===========================
   CREATE PRODUCT
=========================== */

export const createProduct = async (req: any, res: Response) => {
    try {
        // If files are uploaded via multer + cloudinary
        if (req.files && req.files.length) {
            req.body.images = req.files.map((file: any) => file.path);
        }

        const { name, description, price, category, subCategory, stock } = req.body;

        if (
            !String(name || "").trim() ||
            !String(description || "").trim() ||
            price === undefined ||
            stock === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "name, description, price and stock are required"
            });
        }

        const parsedPrice = Number(price);
        const parsedStock = Number(stock);

        if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
            return res.status(400).json({
                success: false,
                message: "Price must be >= 1"
            });
        }

        if (!Number.isInteger(parsedStock) || parsedStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock must be a non-negative integer"
            });
        }

        req.body.price = parsedPrice;
        req.body.stock = parsedStock;

        if (!mongoose.Types.ObjectId.isValid(String(category))) {
            return res.status(400).json({
                success: false,
                message: "Invalid category id"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(String(subCategory))) {
            return res.status(400).json({
                success: false,
                message: "Invalid subcategory id"
            });
        }

        const product = await createProductService(req.body);

        res.status(201).json({
            success: true,
            product
        });

    } catch (err: any) {
        console.error("CREATE PRODUCT ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


/* ===========================
   GET PRODUCTS (WITH PAGINATION)
=========================== */

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProductsService(req.query);

        res.json({
            success: true,
            ...products
        });

    } catch (err: any) {
        console.error("GET PRODUCTS ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


/* ===========================
   UPDATE PRODUCT
=========================== */

export const updateProduct = async (req: any, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product id"
            });
        }

        // Handle image updates
        if (req.files && req.files.length) {
            req.body.images = req.files.map((file: any) => file.path);
        }

        if (req.body.price !== undefined) {
            const parsedPrice = Number(req.body.price);
            if (!Number.isFinite(parsedPrice) || parsedPrice < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Price must be >= 1"
                });
            }
            req.body.price = parsedPrice;
        }

        if (req.body.stock !== undefined) {
            const parsedStock = Number(req.body.stock);
            if (!Number.isInteger(parsedStock) || parsedStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Stock must be a non-negative integer"
                });
            }
            req.body.stock = parsedStock;
        }

        const product = await updateProductService(
            req.params.id,
            req.body
        );

        if (!product)
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        res.json({
            success: true,
            product
        });

    } catch (err: any) {
        console.error("UPDATE PRODUCT ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};


/* ===========================
   DELETE PRODUCT
=========================== */

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleted = await deleteProductService(req.params.id);

        if (!deleted)
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        res.json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (err: any) {
        console.error("DELETE PRODUCT ERROR:", err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
