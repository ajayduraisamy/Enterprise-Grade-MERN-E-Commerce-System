import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { Request, Response } from "express";

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

connectDB();

const app = express();

app.use(express.json());


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("MERN E-commerce TypeScript Backend Running");
});

cloudinary.api.ping()
    .then(() => console.log("Cloudinary Connected"))
    .catch(err => console.error("Cloudinary Error", err));

app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
