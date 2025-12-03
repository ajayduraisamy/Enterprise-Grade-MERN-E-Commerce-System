import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import { isEmail, minLen, sanitize } from "../../utils/validation";

export default function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");

    const [loading, setLoading] = useState(false);

    const submit = async () => {

        // ---------- Sanitize ----------
        const safeName = sanitize(name);
        const safeEmail = sanitize(email);
        const safeAddress = sanitize(address);

        // ---------- Validations ----------
        if (!safeName)
            return alert("Name is required");

        if (!isEmail(safeEmail))
            return alert("Enter a valid email");

        if (!minLen(password))
            return alert("Password must be at least 6 characters");

        if (!/^\d{10}$/.test(mobile))
            return alert("Enter valid 10-digit mobile number");

        if (!safeAddress)
            return alert("Address is required");

        if (!/^\d{6}$/.test(pincode))
            return alert("Enter valid 6-digit pincode");

        // --------------------------------

        try {
            setLoading(true);

            // ---------- API CALL ----------
            await api.post("/auth/register", {
                name: safeName,
                email: safeEmail,
                password,
                mobile,
                address: safeAddress,
                pincode
            });

            // save email for OTP verification
            localStorage.setItem("pendingEmail", safeEmail);

            // redirect to verify OTP screen
            navigate("/verify-otp");

        } catch (err: any) {

            // ✅ Properly read backend error
            const errorMsg =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Registration failed";

            console.log("REGISTER ERROR:", err?.response?.data);
            alert(errorMsg);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-16 p-6 bg-white shadow-lg rounded-xl space-y-3">

            <h2 className="text-2xl font-bold text-center">
                Create Account
            </h2>

            <input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <textarea
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <input
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <button
                disabled={loading}
                onClick={submit}
                className="
    w-full
    h-11
    bg-green-600 hover:bg-green-700
    text-white font-semibold
    py-2
    rounded-lg
    shadow
    transition-all
    active:scale-95
    disabled:opacity-60
  "
            >
                {loading ? "Sending OTP..." : "Register & Send OTP"}
            </button>


            <p className="text-sm text-center">
                Already registered?
                <a href="/login" className="ml-1 text-accent hover:underline">
                    Login
                </a>
            </p>

        </div>
    );
}
