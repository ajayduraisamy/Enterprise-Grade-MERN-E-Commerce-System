import { Request, Response } from "express";

import {
    createProductService,
    getProductsService,
    updateProductService,
    deleteProductService
} from "../services/product.service";

// CREATE
export const createProduct = async (req: Request, res: Response) => {
    try {
        const product = await createProductService(req.body);
        res.status(201).json(product);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// READ
export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await getProductsService();
        res.json(products);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = await updateProductService(
            req.params.id,
            req.body
        );

        if (!product)
            return res.status(404).json({ message: "Not found" });

        res.json(product);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleted = await deleteProductService(req.params.id);

        if (!deleted)
            return res.status(404).json({ message: "Not found" });

        res.json({ message: "Product deleted successfully" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
