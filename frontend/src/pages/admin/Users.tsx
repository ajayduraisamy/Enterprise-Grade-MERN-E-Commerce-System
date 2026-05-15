import { useState, useEffect, useMemo } from "react";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { adminApi } from "../../api";
import type { IUser } from "../../types";
import { useToast } from "../../hooks/useToast";
import { TableSkeleton } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Users() {
    const { showToast } = useToast();
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers();
            setUsers(res.data);
        } catch {
            showToast("Failed to load users", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }, [users, search]);

    const changeRole = async (userId: string, newRole: string) => {
        try {
            await adminApi.updateUserRole(userId, newRole);
            setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole as "user" | "admin" } : u)));
            showToast("User role updated", "success");
        } catch {
            showToast("Failed to update role", "error");
        }
    };

    const deleteUser = async () => {
        if (!deleteTarget) return;
        try {
            await adminApi.deleteUser(deleteTarget.id);
            setUsers((prev) => prev.filter((u) => u._id !== deleteTarget.id));
            showToast("User deleted", "success");
            setDeleteTarget(null);
        } catch {
            showToast("Failed to delete user", "error");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>

            <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6"><TableSkeleton rows={5} /></div>
                ) : filtered.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-12">No users found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Joined</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user) => (
                                    <tr key={user._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="p-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => changeRole(user._id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none transition cursor-pointer ${user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700"
                                                    : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                                    }`}
                                            >
                                                <option value="user">User</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-4">
                                            {user.isVerified ? (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Verified</span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Unverified</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(new Date().toISOString())}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setDeleteTarget({ id: user._id, name: user.name })}
                                                disabled={user.role === "admin"}
                                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                                title={user.role === "admin" ? "Cannot delete admin" : "Delete user"}
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete User" size="sm">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{deleteTarget?.name}</strong>? This action is irreversible.
                </p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={deleteUser} className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition">Delete</button>
                </div>
            </Modal>
        </div>
    );
}
