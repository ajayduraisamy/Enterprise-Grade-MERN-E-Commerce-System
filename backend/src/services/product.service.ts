import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";

/* ===========================
   CREATE
=========================== */
export const createProductService = async (data: any) => {
    return await Product.create(data);
};

/* ===========================
   READ - PAGINATED + FILTERED
=========================== */
export const getProductsService = async (params: any) => {

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

    return {
        products: finalProducts,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        }
    };
};

/* ===========================
   UPDATE
=========================== */
export const updateProductService = async (id: string, data: any) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

/* ===========================
   DELETE
=========================== */
export const deleteProductService = async (id: string) => {
    return await Product.findByIdAndDelete(id);
};
