import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50).trim(),
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
    mobile: z.string().regex(/^\d{10}$/, "Invalid mobile number (10 digits required)"),
    address: z.string().min(5, "Address must be at least 5 characters").max(200).trim(),
    pincode: z.string().regex(/^\d{6}$/, "Invalid pincode (6 digits required)"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z.string().min(1, "Password is required"),
});

export const productSchema = z.object({
    name: z.string().min(2).max(100).trim(),
    description: z.string().min(10).max(2000).trim(),
    price: z.number().min(1, "Price must be >= 1"),
    category: z.string().min(1, "Category is required"),
    subCategory: z.string().min(1, "SubCategory is required"),
    stock: z.number().int().min(0, "Stock must be non-negative"),
});

export const reviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(2).max(500).trim(),
});

export const addressSchema = z.object({
    fullName: z.string().min(2).max(50).trim(),
    phone: z.string().regex(/^\d{10}$/),
    street: z.string().min(5).max(100).trim(),
    city: z.string().min(2).max(50).trim(),
    state: z.string().min(2).max(50).trim(),
    pincode: z.string().regex(/^\d{6}$/),
});
