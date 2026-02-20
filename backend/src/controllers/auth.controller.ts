import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import { generateOtp } from "../utils/otp";
import { sendEmail } from "../utils/sendEmail";

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

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
            pincode
        } = req.body;

        if (!name || !email || !password || !mobile || !address || !pincode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!/^\d{10}$/.test(String(mobile))) {
            return res.status(400).json({ message: "Invalid mobile number" });
        }

        if (!/^\d{6}$/.test(String(pincode))) {
            return res.status(400).json({ message: "Invalid pincode" });
        }

        const exists = await User.findOne({ email: normalizedEmail });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashed,
            mobile: String(mobile),
            address: String(address).trim(),
            pincode: String(pincode),
            role: "user",
            isVerified: false,
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000)
        });

        await sendEmail(
            normalizedEmail,
            "Verify your account - OTP",
            `
                <div style="font-family:sans-serif">
                    <h2>Welcome ${String(name).trim()}</h2>
                    <p>Your OTP for verification is:</p>
                    <h1 style="color:#0d6efd;">${otp}</h1>
                    <p>OTP valid for 5 minutes</p>
                </div>
            `
        );

        return res.status(201).json({
            message: "User registered successfully. OTP has been sent to your email."
        });
    } catch (err: any) {
        console.error("REGISTER ERROR:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* ============================
   VERIFY OTP
============================ */

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!/^\d{6}$/.test(String(otp))) {
            return res.status(400).json({ message: "Invalid OTP format" });
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) return res.status(404).json({ message: "User not found" });
        if (user.isVerified) return res.status(400).json({ message: "Account already verified" });
        if (user.otp !== String(otp)) return res.status(400).json({ message: "Invalid OTP" });
        if (!user.otpExpiry || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        return res.json({ message: "Email verified successfully" });
    } catch (err: any) {
        console.error("VERIFY OTP ERROR:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

/* ============================
   LOGIN (BLOCK UNTIL VERIFIED)
============================ */

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (!isValidEmail(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email before login"
            });
        }

        const matched = await bcrypt.compare(password, user.password);
        if (!matched) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        return res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });
    } catch (err: any) {
        console.error("LOGIN ERROR:", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};
