import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (req: Request, res: Response) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            address,
            pincode,
            role
        } = req.body;

        // check existing user
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "User already exists" });

        // hash password
        const hashed = await bcrypt.hash(password, 10);

    
        const user = await User.create({
            name,
            email,
            password: hashed,
            mobile,
            address,
            pincode,
            role: role || "user"
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const matched = await bcrypt.compare(password, user.password);
        if (!matched)
            return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
