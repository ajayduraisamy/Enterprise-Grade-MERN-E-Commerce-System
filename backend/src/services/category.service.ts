import Category from "../models/Category";

export const createCategoryService = async (name: string) => {
    return await Category.create({ name });
};

export const getAllCategoriesService = async () => {
    return await Category.find().sort({ name: 1 });
};

export const updateCategoryService = async (
    id: string,
    name: string
) => {
    return await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );
};

export const deleteCategoryService = async (id: string) => {
    return await Category.findByIdAndDelete(id);
};
