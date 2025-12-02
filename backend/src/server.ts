import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import connectDB from "./config/db";

import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import subCategoryRoutes from "./routes/subcategory.routes";
import productRoutes from "./routes/product.routes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send(" MERN E-commerce TypeScript Backend Running");
});

app.listen(5000, () => {
    console.log(" Server started http://localhost:5000");
});
