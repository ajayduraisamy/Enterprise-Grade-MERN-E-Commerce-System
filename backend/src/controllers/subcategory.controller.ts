import { Request, Response } from "express";
import {
    createSubCategoryService,
    getAllSubCategoriesService,
    updateSubCategoryService,
    deleteSubCategoryService
} from "../services/subcategory.service";

// CREATE
export const createSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, categoryId } = req.body;

        const sub = await createSubCategoryService(name, categoryId);

        res.status(201).json(sub);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// READ
export const getSubCategories = async (req: Request, res: Response) => {
    try {
        const subs = await getAllSubCategoriesService();
        res.json(subs);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE
export const updateSubCategory = async (req: Request, res: Response) => {
    try {
        const { name, categoryId } = req.body;

        const sub = await updateSubCategoryService(
            req.params.id,
            name,
            categoryId
        );

        if (!sub)
            return res.status(404).json({ message: "Not found" });

        res.json(sub);

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE
export const deleteSubCategory = async (req: Request, res: Response) => {
    try {
        const result = await deleteSubCategoryService(req.params.id);

        if (!result)
            return res.status(404).json({ message: "Not found" });

        res.json({
            message: "Subcategory deleted successfully"
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
