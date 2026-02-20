import { Request, Response } from "express";
import mongoose from "mongoose";
import {
    createCategoryService,
    getAllCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service";

// CREATE
export const createCategory = async (req: Request, res: Response) => {
    try {
        const name = String(req.body.name || "").trim();
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await createCategoryService(name);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// READ
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await getAllCategoriesService();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// UPDATE
export const updateCategory = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category id" });
        }

        const name = String(req.body.name || "").trim();
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const category = await updateCategoryService(
            req.params.id,
            name
        );

        if (!category)
            return res.status(404).json({ message: "Not found" });

        res.json(category);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid category id" });
        }

        const result = await deleteCategoryService(req.params.id);

        if (!result)
            return res.status(404).json({ message: "Not found" });

        res.json({ message: "Category deleted successfully" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
