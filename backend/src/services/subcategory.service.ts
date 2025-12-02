import SubCategory from "../models/SubCategory";

export const createSubCategoryService = async (
    name: string,
    categoryId: string
) => {
    return await SubCategory.create({
        name,
        category: categoryId
    });
};

export const getAllSubCategoriesService = async () => {
    return await SubCategory
        .find()
        .populate("category", "name")
        .sort({ name: 1 });
};

export const updateSubCategoryService = async (
    id: string,
    name: string,
    categoryId: string
) => {
    return await SubCategory.findByIdAndUpdate(
        id,
        {
            name,
            category: categoryId
        },
        { new: true }
    );
};

export const deleteSubCategoryService = async (id: string) => {
    return await SubCategory.findByIdAndDelete(id);
};
