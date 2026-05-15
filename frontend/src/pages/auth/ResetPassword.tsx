import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FiLock } from "react-icons/fi";

export default function ResetPassword() {
    useSearchParams();
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return;
        setSuccess(true);
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-gray-500 dark:text-gray-400">Enter your new password</p>
                </div>
                {success ? (
                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl text-center">
                        <FiLock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <p className="text-green-800 dark:text-green-200 font-semibold">Password reset successfully!</p>
                        <Link to="/login" className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-semibold">Go to Login</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="password"
                            placeholder="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {password !== confirm && confirm && (
                            <p className="text-red-500 text-sm">Passwords do not match</p>
                        )}
                        <button
                            type="submit"
                            disabled={password !== confirm || !password}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
                        >
                            Reset Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
