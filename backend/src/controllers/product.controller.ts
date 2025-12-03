import { Request, Response } from "express";

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
        // Handle image updates
        if (req.files && req.files.length) {
            req.body.images = req.files.map((file: any) => file.path);
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
