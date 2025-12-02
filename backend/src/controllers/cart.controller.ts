import { Request, Response } from "express";
import {
    addToCartService,
    updateCartQtyService,
    removeFromCartService,
    getCartService
} from "../services/cart.service";

export const addToCart = async (req: any, res: Response) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await addToCartService(
            req.user.id,
            productId,
            quantity || 1
        );

        res.json(cart);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


export const updateCartQty = async (req: any, res: Response) => {
    try {
        const { quantity } = req.body;

        const cart = await updateCartQtyService(
            req.user.id,
            req.params.productId,
            quantity
        );

        res.json(cart);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


export const removeFromCart = async (req: any, res: Response) => {
    try {
        const cart = await removeFromCartService(
            req.user.id,
            req.params.productId
        );

        res.json(cart);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};


export const getCart = async (req: any, res: Response) => {
    try {
        const cart = await getCartService(
            req.user.id
        );

        res.json(cart);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
