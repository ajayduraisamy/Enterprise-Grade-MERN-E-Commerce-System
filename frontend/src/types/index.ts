export interface IUser {
    _id: string;
    name: string;
    email: string;
    role: "user" | "admin";
    mobile?: string;
    address?: string;
    pincode?: string;
    isVerified: boolean;
    avatar?: string;
}

export interface ICategory {
    _id: string;
    name: string;
}

export interface ISubCategory {
    _id: string;
    name: string;
    category: string | ICategory;
    offerPercent?: number;
}

export interface IReview {
    _id?: string;
    user: { _id: string; name: string };
    rating: number;
    comment: string;
    createdAt: string;
}

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    finalPrice: number;
    category: ICategory;
    subCategory: ISubCategory;
    stock: number;
    images: string[];
    isActive: boolean;
    reviews: IReview[];
    averageRating: number;
    reviewCount: number;
    createdAt: string;
}

export interface ICartItem {
    product: IProduct;
    quantity: number;
    _id?: string;
}

export interface IOrder {
    _id: string;
    user: string | IUser;
    items: { product: IProduct; quantity: number; price: number; _id: string }[];
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: "COD" | "UPI";
    paymentStatus: "PENDING" | "PAID";
    paymentId?: string;
    paidAt?: string;
    status: "PLACED" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    createdAt: string;
}

export interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IAuthResponse {
    user: IUser;
    token: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterData {
    name: string;
    email: string;
    password: string;
    mobile: string;
    address: string;
    pincode: string;
}

export interface IProductFilters {
    search?: string;
    category?: string;
    subCategory?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    rating?: number;
    inStock?: boolean;
}

export interface IAddress {
    _id?: string;
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    isDefault?: boolean;
}

export interface ICoupon {
    _id: string;
    code: string;
    discountPercent: number;
    minOrderValue: number;
    maxDiscount: number;
    validUntil: string;
    isActive: boolean;
}
