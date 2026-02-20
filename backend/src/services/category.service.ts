import Category from "../models/Category";
import { deleteCache, getCache, setCache } from "../utils/cache";

const CATEGORY_CACHE_KEY = "categories:all";
const CATEGORY_CACHE_TTL = 60 * 10;

export const createCategoryService = async (name: string) => {
    const category = await Category.create({ name });
    await deleteCache(CATEGORY_CACHE_KEY);
    return category;
};

export const getAllCategoriesService = async () => {
    const cached = await getCache<any[]>(CATEGORY_CACHE_KEY);
    if (cached) return cached;

    const categories = await Category.find().sort({ name: 1 }).lean();
    await setCache(CATEGORY_CACHE_KEY, categories, CATEGORY_CACHE_TTL);
    return categories;
};

export const updateCategoryService = async (
    id: string,
    name: string
) => {
    const category = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );

    await deleteCache(CATEGORY_CACHE_KEY);
    return category;
};

export const deleteCategoryService = async (id: string) => {
    const deleted = await Category.findByIdAndDelete(id);
    await deleteCache(CATEGORY_CACHE_KEY);
    return deleted;
};
