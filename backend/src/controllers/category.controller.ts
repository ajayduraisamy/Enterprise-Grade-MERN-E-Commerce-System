import { Request, Response } from "express";
import {
    createCategoryService,
    getAllCategoriesService,
    updateCategoryService,
    deleteCategoryService
} from "../services/category.service";

// CREATE
export const createCategory = async (req: Request, res: Response) => {
    try {
        const category = await createCategoryService(req.body.name);
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
        const category = await updateCategoryService(
            req.params.id,
            req.body.name
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
        const result = await deleteCategoryService(req.params.id);

        if (!result)
            return res.status(404).json({ message: "Not found" });

        res.json({ message: "Category deleted successfully" });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
