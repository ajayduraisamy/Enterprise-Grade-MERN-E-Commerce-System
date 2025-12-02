import Product from "../models/Product";
import { calculateFinalPrice } from "../utils/price";
import SubCategory from "../models/SubCategory";

// CREATE
export const createProductService = async (data: any) => {
    return await Product.create(data);
};

// READ (WITH OFFER PRICE)
export const getProductsService = async () => {

    const products = await Product
        .find({ isActive: true })
        .populate("category", "name")
        .populate("subCategory", "name offerPercent");

    return products.map((p: any) => {

        const finalPrice = calculateFinalPrice(
            p.price,
            p.subCategory?.offerPercent
        );

        return {
            ...p.toObject(),
            finalPrice
        };
    });
};

// UPDATE
export const updateProductService = async (
    id: string,
    data: any
) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
};

// DELETE
export const deleteProductService = async (id: string) => {
    return await Product.findByIdAndDelete(id);
};
