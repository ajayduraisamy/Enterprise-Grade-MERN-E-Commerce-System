import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { generateOtp } from "../utils/otp";
import { sendEmail } from "../utils/sendEmail";

/* ============================
   REGISTER WITH OTP
============================ */

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

        // Check existing user
        const exists = await User.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "User already exists" });

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = generateOtp();

        // Create user with OTP fields
        const user = await User.create({
            name,
            email,
            password: hashed,
            mobile,
            address,
            pincode,
            role: role || "user",

            isVerified: false,
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        });

        // Send OTP email
        await sendEmail(
            email,
            "Verify your account - OTP",
            `
                <div style="font-family:sans-serif">
                    <h2>Welcome ${name}</h2>
                    <p>Your OTP for verification is:</p>
                    <h1 style="color:#0d6efd;">${otp}</h1>
                    <p>OTP valid for 5 minutes</p>
                </div>
            `
        );

        res.status(201).json({
            message: "User registered successfully. OTP has been sent to your email."
        });

    } catch (err: any) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

/* ============================
   VERIFY OTP
============================ */

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (user.isVerified)
            return res.status(400).json({ message: "Account already verified" });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        if (!user.otpExpiry || user.otpExpiry < new Date())
            return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.json({ message: "✅ Email verified successfully" });

    } catch (err: any) {
        console.error("VERIFY OTP ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};

/* ============================
   LOGIN (BLOCK UNTIL VERIFIED)
============================ */

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        // ✅ BLOCK LOGIN UNTIL VERIFIED
        if (!user.isVerified)
            return res.status(403).json({
                message: "Please verify your email before login"
            });

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
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
};
