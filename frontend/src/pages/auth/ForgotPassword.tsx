import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft } from "react-icons/fi";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSent(true);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Forgot Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">Enter your email to receive a reset link</p>
                </div>
                {sent ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
                        <FiMail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <p className="text-green-800 dark:text-green-200 font-semibold">Reset link sent!</p>
                        <p className="text-green-600 dark:text-green-400 text-sm mt-2">Check your email for instructions</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                        >
                            Send Reset Link
                        </button>
                    </form>
                )}
                <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700">
                        <FiArrowLeft className="mr-1" /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
