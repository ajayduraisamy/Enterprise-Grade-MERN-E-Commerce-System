import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import connectDB from "./config/db.ts";

dotenv.config();

const app = express();

// CONNECT DATABASE
connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    res.send("✅ MERN E-commerce TypeScript Backend Running");
});

app.listen(5000, () => {
    console.log("🔥 Server started http://localhost:5000");
});
