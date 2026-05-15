import api from "./axios";
import type { IAuthResponse, ILoginCredentials, IRegisterData, IProduct, IProductFilters, IPagination, IOrder, ICoupon, ICategory, ISubCategory, IUser, IReview, ICartItem } from "../types";

export const authApi = {
    login: (data: ILoginCredentials) => api.post<IAuthResponse>("/auth/login", data),
    register: (data: IRegisterData) => api.post<{ message: string }>("/auth/register", data),
    verifyOtp: (email: string, otp: string) => api.post<{ message: string }>("/auth/verify-otp", { email, otp }),
    forgotPassword: (email: string) => api.post<{ message: string }>("/auth/forgot-password", { email }),
    resetPassword: (email: string, otp: string, password: string) => api.post<{ message: string }>("/auth/reset-password", { email, otp, password }),
};

export const productApi = {
    getAll: (params?: IProductFilters) => api.get<{ success: boolean; products: IProduct[]; pagination: IPagination }>("/products", { params }),
    getById: (id: string) => api.get<{ success: boolean; product: IProduct }>(`/products/${id}`),
    create: (data: FormData) => api.post<{ success: boolean; product: IProduct }>("/products", data, { headers: { "Content-Type": "multipart/form-data" } }),
    update: (id: string, data: FormData) => api.put<{ success: boolean; product: IProduct }>(`/products/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
    delete: (id: string) => api.delete<{ success: boolean; message: string }>(`/products/${id}`),
};

export const categoryApi = {
    getAll: () => api.get<ICategory[]>("/categories"),
    create: (name: string) => api.post<ICategory>("/categories", { name }),
    update: (id: string, name: string) => api.put<ICategory>(`/categories/${id}`, { name }),
    delete: (id: string) => api.delete<{ message: string }>(`/categories/${id}`),
};

export const subCategoryApi = {
    getAll: () => api.get<ISubCategory[]>("/subcategories"),
    create: (name: string, categoryId: string) => api.post<ISubCategory>("/subcategories", { name, categoryId }),
    update: (id: string, name: string, categoryId: string) => api.put<ISubCategory>(`/subcategories/${id}`, { name, categoryId }),
    delete: (id: string) => api.delete<{ message: string }>(`/subcategories/${id}`),
};

export const cartApi = {
    get: () => api.get<ICartItem[]>("/cart"),
    add: (productId: string, quantity?: number) => api.post<any>("/cart", { productId, quantity }),
    updateQty: (productId: string, quantity: number) => api.put<any>(`/cart/${productId}`, { quantity }),
    remove: (productId: string) => api.delete<any>(`/cart/${productId}`),
};

export const orderApi = {
    place: (shippingAddress: string, paymentMethod?: string) => api.post<IOrder>("/orders", { shippingAddress, paymentMethod }),
    getMy: () => api.get<IOrder[]>("/orders/my"),
    getAll: () => api.get<IOrder[]>("/admin/orders"),
    updateStatus: (orderId: string, status: string) => api.put<{ message: string; order: IOrder }>(`/orders/${orderId}`, { status }),
};

export const paymentApi = {
    mockSuccess: (orderId: string) => api.post<{ success: boolean; message: string; order: IOrder }>("/payments/mock-success", { orderId }),
};

export const adminApi = {
    getDashboard: () => api.get<{ totalOrders: number; totalRevenue: number; todayOrders: number; pendingOrders: number }>("/admin/dashboard"),
    getOrders: () => api.get<IOrder[]>("/admin/orders"),
    getOrdersByStatus: (status: string) => api.get<IOrder[]>(`/admin/orders/${status}`),
    getUsers: () => api.get<IUser[]>("/users"),
    updateUserRole: (id: string, role: string) => api.put<IUser>(`/users/${id}/role`, { role }),
    deleteUser: (id: string) => api.delete<{ message: string }>(`/users/${id}`),
};

export const reviewApi = {
    getProductReviews: (productId: string, page?: number, limit?: number) => api.get<{ reviews: IReview[]; pagination: IPagination }>(`/reviews/${productId}`, { params: { page, limit } }),
    add: (productId: string, rating: number, comment: string) => api.post<{ message: string; review: IReview }>(`/reviews/${productId}`, { rating, comment }),
    delete: (reviewId: string) => api.delete<{ message: string }>(`/reviews/${reviewId}`),
};

export const couponApi = {
    validate: (code: string, orderValue: number) => api.post<{ valid: boolean; discount: number; coupon: ICoupon }>("/coupons/validate", { code, orderValue }),
    getAll: () => api.get<ICoupon[]>("/coupons"),
    create: (data: Partial<ICoupon>) => api.post<ICoupon>("/coupons", data),
    delete: (id: string) => api.delete<{ message: string }>(`/coupons/${id}`),
};

export const wishlistApi = {
    get: () => api.get<IProduct[]>("/wishlist"),
    add: (productId: string) => api.post<{ message: string }>("/wishlist", { productId }),
    remove: (productId: string) => api.delete<{ message: string }>(`/wishlist/${productId}`),
};

export const userApi = {
    getProfile: () => api.get<IUser>("/users/profile"),
    updateProfile: (data: Partial<IUser>) => api.put<IUser>("/users/profile", data),
    updatePassword: (currentPassword: string, newPassword: string) => api.put<{ message: string }>("/users/password", { currentPassword, newPassword }),
};
