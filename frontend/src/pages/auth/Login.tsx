import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { isEmail, sanitize } from "../../utils/validation";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const submit = async () => {

        const safeEmail = sanitize(email);

        if (!isEmail(safeEmail))
            return alert("Enter valid email");

        if (!password)
            return alert("Password required");

        try {

            const res = await api.post("/auth/login", {
                email: safeEmail,
                password
            });

            // Save user + token
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            // ✅ Direct dashboard redirect (NO OTP)
            if (res.data.user.role === "admin")
                navigate("/admin");
            else
                navigate("/user");

        } catch (err: any) {

            alert(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Login failed"
            );

        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 space-y-4">

            <h2 className="text-xl font-bold text-center">
                Login
            </h2>

            <input
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
            />

            <button
                onClick={submit}
                className="w-full bg-user text-white py-2 rounded"
            >
                Login
            </button>

        </div>
    );
}
