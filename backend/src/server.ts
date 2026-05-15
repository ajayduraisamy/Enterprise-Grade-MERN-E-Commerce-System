import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Request, Response } from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import connectDB from "./config/db";
import cloudinary from "./config/cloudinary";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import subCategoryRoutes from "./routes/subcategory.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import paymentRoutes from "./routes/payment.routes";
import adminRoutes from "./routes/admin.routes";
import userRoutes from "./routes/user.routes";
import reviewRoutes from "./routes/review.routes";
import couponRoutes from "./routes/coupon.routes";
import wishlistRoutes from "./routes/wishlist.routes";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFound } from "./middleware/error.middleware";

connectDB();

const app = express();
const PORT = Number(process.env.PORT || 5000);

// ==================== SECURITY MIDDLEWARE ====================

// Helmet — sets various HTTP security headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));

// Body parsing with size limits
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ["price", "rating", "stock", "sort", "page", "limit", "category"],
}));

// Rate limiting
app.use(generalLimiter);

// CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ==================== ROUTES ====================
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/wishlist", wishlistRoutes);

app.get("/", (req: Request, res: Response) => {
    res.json({
        name: "LuxeCart API",
        version: "1.0.0",
        status: "running",
        docs: "/api/health"
    });
});

// ==================== ERROR HANDLING ====================
app.use(notFound);
app.use(errorHandler);

// Cloudinary connection check
cloudinary.api.ping()
    .then(() => console.log("Cloudinary Connected"))
    .catch((err: unknown) => console.error("Cloudinary Error", err));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
