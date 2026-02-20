import SubCategory from "../models/SubCategory";
import {
    clearCacheByPrefix,
    deleteCache,
    getCache,
    setCache
} from "../utils/cache";

const SUBCATEGORY_CACHE_KEY = "subcategories:all";
const SUBCATEGORY_CACHE_TTL = 60 * 10;

export const createSubCategoryService = async (
    name: string,
    categoryId: string
) => {
    const subcategory = await SubCategory.create({
        name,
        category: categoryId
    });

    await deleteCache(SUBCATEGORY_CACHE_KEY);
    await clearCacheByPrefix("products:list:");

    return subcategory;
};

export const getAllSubCategoriesService = async () => {
    const cached = await getCache<any[]>(SUBCATEGORY_CACHE_KEY);
    if (cached) return cached;

    const subcategories = await SubCategory
        .find()
        .populate("category", "name")
        .sort({ name: 1 })
        .lean();

    await setCache(SUBCATEGORY_CACHE_KEY, subcategories, SUBCATEGORY_CACHE_TTL);
    return subcategories;
};

export const updateSubCategoryService = async (
    id: string,
    name: string,
    categoryId: string
) => {
    const subcategory = await SubCategory.findByIdAndUpdate(
        id,
        {
            name,
            category: categoryId
        },
        { new: true }
    );

    await deleteCache(SUBCATEGORY_CACHE_KEY);
    await clearCacheByPrefix("products:list:");

    return subcategory;
};

export const deleteSubCategoryService = async (id: string) => {
    const deleted = await SubCategory.findByIdAndDelete(id);

    await deleteCache(SUBCATEGORY_CACHE_KEY);
    await clearCacheByPrefix("products:list:");

    return deleted;
};
