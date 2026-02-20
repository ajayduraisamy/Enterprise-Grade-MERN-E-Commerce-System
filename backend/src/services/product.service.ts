import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";
import { clearCacheByPrefix, getCache, setCache } from "../utils/cache";

const PRODUCT_LIST_CACHE_TTL = 60 * 5;

const buildProductListCacheKey = (params: any): string => {
    const entries = [
        ["page", String(params.page ?? 1)],
        ["limit", String(params.limit ?? 12)],
        ["search", String(params.search ?? "")],
        ["category", String(params.category ?? "")],
        ["subCategory", String(params.subCategory ?? "")],
        ["minPrice", String(params.minPrice ?? "")],
        ["maxPrice", String(params.maxPrice ?? "")],
        ["sort", String(params.sort ?? "")]
    ];

    return `products:list:${new URLSearchParams(entries).toString()}`;
};

/* ===========================
   CREATE
=========================== */
export const createProductService = async (data: any) => {
    const product = await Product.create(data);
    await clearCacheByPrefix("products:list:");
    return product;
};

/* ===========================
   READ - PAGINATED + FILTERED
=========================== */
export const getProductsService = async (params: any) => {
    const cacheKey = buildProductListCacheKey(params);
    const cached = await getCache<any>(cacheKey);
    if (cached) return cached;

    const {
        page = 1,
        limit = 12,
        search,
        category,
        subCategory,
        minPrice,
        maxPrice,
        sort
    } = params;

    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = { isActive: true };

    // TEXT SEARCH
    if (search) {
        filter.$text = { $search: search };
    }

    if (category) filter.category = category;

    if (subCategory) filter.subCategory = subCategory;

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortObj: any = { createdAt: -1 };

    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };

    const products = await Product.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .populate("category", "name")
        .populate("subCategory", "name offerPercent")
        .select("name images price category subCategory reviews averageRating isActive")
        .lean();

    const finalProducts = products.map((p: any) => {
        const finalPrice = calculateFinalPrice(
            p.price,
            p.subCategory?.offerPercent
        );

        return {
            ...p,
            finalPrice
        };
    });

    const total = await Product.countDocuments(filter);

    const response = {
        products: finalProducts,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        }
    };

    await setCache(cacheKey, response, PRODUCT_LIST_CACHE_TTL);
    return response;
};

/* ===========================
   UPDATE
=========================== */
export const updateProductService = async (id: string, data: any) => {
    const product = await Product.findByIdAndUpdate(id, data, { new: true });
    await clearCacheByPrefix("products:list:");
    return product;
};

/* ===========================
   DELETE
=========================== */
export const deleteProductService = async (id: string) => {
    const deleted = await Product.findByIdAndDelete(id);
    await clearCacheByPrefix("products:list:");
    return deleted;
};
