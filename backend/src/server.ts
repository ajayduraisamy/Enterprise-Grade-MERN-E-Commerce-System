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

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("MERN E-commerce TypeScript Backend Running");
});

cloudinary.api.ping()
    .then(() => console.log(" Cloudinary Connected"))
    .catch(err => console.error(" Cloudinary Error", err));

app.listen(5000, () => {
    console.log(" Server started http://localhost:5000");
});

// import { sendEmail } from "./utils/sendEmail";

// sendEmail(
//     "ajaydloner@gmail.com",
//     "Test Email",
//     "<h3>Email system working ✅</h3>"
// );
