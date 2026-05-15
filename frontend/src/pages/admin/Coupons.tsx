import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { couponApi } from "../../api";
import { useToast } from "../../hooks/useToast";
import { TableSkeleton } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";

interface CouponForm {
    code: string;
    discountPercent: number;
    minOrderValue: number;
    maxDiscount: number;
    validFrom: string;
    validUntil: string;
    usageLimit: number;
}

const defaultForm: CouponForm = {
    code: "",
    discountPercent: 0,
    minOrderValue: 0,
    maxDiscount: 0,
    validFrom: "",
    validUntil: "",
    usageLimit: 0,
};

function formatDate(dateStr: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Coupons() {
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<CouponForm>(defaultForm);
    const [submitting, setSubmitting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; code: string } | null>(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const res = await couponApi.getAll();
            setCoupons(res.data);
        } catch {
            showToast("Failed to load coupons", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleSubmit = async () => {
        if (!form.code.trim()) { showToast("Coupon code is required", "error"); return; }
        setSubmitting(true);
        try {
            await couponApi.create(form as any);
            showToast("Coupon created", "success");
            setModalOpen(false);
            setForm(defaultForm);
            fetchCoupons();
        } catch {
            showToast("Failed to create coupon", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteCoupon = async () => {
        if (!deleteTarget) return;
        try {
            await couponApi.delete(deleteTarget.id);
            showToast("Coupon deleted", "success");
            setDeleteTarget(null);
            fetchCoupons();
        } catch {
            showToast("Failed to delete coupon", "error");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Coupons</h1>
                <button onClick={() => { setForm(defaultForm); setModalOpen(true); }} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center gap-2 shadow-lg shadow-blue-600/20">
                    <FiPlus className="w-4 h-4" /> Add Coupon
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6"><TableSkeleton rows={5} /></div>
                ) : coupons.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-12">No coupons yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Code</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Discount</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Min Order</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Max Discount</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Valid Until</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Usage</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.map((coupon: any) => {
                                    const isExpired = coupon.validUntil && new Date(coupon.validUntil) < new Date();
                                    return (
                                        <tr key={coupon._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="p-4">
                                                <span className="font-mono font-bold text-gray-900 dark:text-white uppercase">{coupon.code}</span>
                                            </td>
                                            <td className="p-4 font-semibold text-gray-900 dark:text-white">{coupon.discountPercent}%</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">₹{coupon.minOrderValue?.toLocaleString("en-IN") || 0}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">₹{coupon.maxDiscount?.toLocaleString("en-IN") || 0}</td>
                                            <td className="p-4 text-gray-500 dark:text-gray-400">{formatDate(coupon.validUntil)}</td>
                                            <td className="p-4 text-gray-700 dark:text-gray-300">
                                                {(coupon as any).usedCount || 0}/{(coupon as any).usageLimit || "∞"}
                                            </td>
                                            <td className="p-4">
                                                {isExpired ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Expired</span>
                                                ) : coupon.isActive ? (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Inactive</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => setDeleteTarget({ id: coupon._id, code: coupon.code })} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition"><FiTrash2 className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Coupon" size="lg">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                        <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="e.g. SAVE20" className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition uppercase" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Discount %</label>
                            <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Min Order Value (₹)</label>
                            <input type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max Discount (₹)</label>
                            <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usage Limit</label>
                            <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valid From</label>
                            <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Valid Until</label>
                            <input type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium">Cancel</button>
                        <button onClick={handleSubmit} disabled={submitting || !form.code.trim()} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-blue-600/20">
                            {submitting ? "Creating..." : "Create Coupon"}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Coupon" size="sm">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete coupon <strong className="text-gray-900 dark:text-white uppercase">{deleteTarget?.code}</strong>?
                </p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={deleteCoupon} className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition">Delete</button>
                </div>
            </Modal>
        </div>
    );
}
