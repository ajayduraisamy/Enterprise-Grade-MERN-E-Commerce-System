import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function VerifyOtp() {

    const navigate = useNavigate();
    const [otp, setOtp] = useState("");

    const email = localStorage.getItem("pendingEmail");

    const submit = async () => {

        if (!email)
            return alert("Registration session expired. Please register again.");

        if (!otp || otp.length !== 6)
            return alert("Enter valid 6-digit OTP");

        try {

            await api.post("/auth/verify-otp", {
                email,
                otp
            });

            // ✅ Clear pending register session
            localStorage.removeItem("pendingEmail");

            // ✅ After verify → go to LOGIN
            alert("✅ Email verified successfully. Please login.");

            navigate("/login");

        } catch (err: any) {

            alert(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "OTP verification failed"
            );

        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 space-y-4">

            <h2 className="text-xl font-bold text-center">
                Verify OTP
            </h2>

            <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
                className="border p-2 w-full tracking-widest text-center"
            />

            <button
                onClick={submit}
                className="
        w-full
        h-11
        flex items-center justify-center
        bg-green-600 hover:bg-green-700
        text-white text-base font-semibold
        rounded-lg
        shadow-md
        transition-all
        active:scale-95
    "
            >
                Verify & Continue
            </button>


        </div>
    );
}
