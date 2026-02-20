import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    addToCartService,
    updateCartQtyService,
    removeFromCartService,
    getCartService
} from "../services/cart.service";

export const addToCart = async (req: any, res: Response) => {
    try {
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(String(productId))) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const qty = Number(quantity || 1);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }

        const cart = await addToCartService(
            req.user.id,
            productId,
            qty
        );

        res.json(cart);
    } catch (err: any) {
        if (err.message === "User not found" || err.message === "Product not available") {
            return res.status(404).json({ error: err.message });
        }

        if (
            err.message === "Quantity must be at least 1" ||
            err.message === "Requested quantity exceeds stock"
        ) {
            return res.status(400).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
};


export const updateCartQty = async (req: any, res: Response) => {
    try {
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(String(req.params.productId))) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const qty = Number(quantity);
        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }

        const cart = await updateCartQtyService(
            req.user.id,
            req.params.productId,
            qty
        );

        res.json(cart);
    } catch (err: any) {
        if (
            err.message === "User not found" ||
            err.message === "Product not available" ||
            err.message === "Cart item not found"
        ) {
            return res.status(404).json({ error: err.message });
        }

        if (
            err.message === "Quantity must be at least 1" ||
            err.message === "Requested quantity exceeds stock"
        ) {
            return res.status(400).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
};


export const removeFromCart = async (req: any, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(String(req.params.productId))) {
            return res.status(400).json({ error: "Invalid product id" });
        }

        const cart = await removeFromCartService(
            req.user.id,
            req.params.productId
        );

        res.json(cart);
    } catch (err: any) {
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
};


export const getCart = async (req: any, res: Response) => {
    try {
        const cart = await getCartService(
            req.user.id
        );

        res.json(cart);
    } catch (err: any) {
        if (err.message === "User not found") {
            return res.status(404).json({ error: err.message });
        }

        return res.status(500).json({ error: err.message });
    }
};
