import { useState, useEffect, useMemo } from "react";
import { FiStar, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { productApi, reviewApi } from "../../api";
import { useToast } from "../../hooks/useToast";
import { TableSkeleton } from "../../components/ui/Skeleton";
import Modal from "../../components/ui/Modal";
import StarRating from "../../components/ui/StarRating";

interface ReviewWithProduct {
    _id?: string;
    user: { _id: string; name: string };
    rating: number;
    comment: string;
    createdAt: string;
    productName: string;
    productId: string;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function Reviews() {
    const { showToast } = useToast();
    const [reviews, setReviews] = useState<ReviewWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [ratingFilter, setRatingFilter] = useState<number>(0);
    const [deleteTarget, setDeleteTarget] = useState<{ reviewId: string; productId: string } | null>(null);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await productApi.getAll({ limit: 100 });
            const allReviews: ReviewWithProduct[] = [];
            for (const product of res.data.products) {
                if (product.reviews?.length) {
                    for (const r of product.reviews) {
                        allReviews.push({
                            ...r,
                            productName: product.name,
                            productId: product._id,
                        });
                    }
                }
            }
            allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReviews(allReviews);
        } catch {
            showToast("Failed to load reviews", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const filtered = useMemo(() => {
        if (!ratingFilter) return reviews;
        return reviews.filter((r) => r.rating === ratingFilter);
    }, [reviews, ratingFilter]);

    const deleteReview = async () => {
        if (!deleteTarget) return;
        try {
            await reviewApi.delete(deleteTarget.reviewId);
            setReviews((prev) => prev.filter((r) => r._id !== deleteTarget.reviewId));
            showToast("Review deleted", "success");
            setDeleteTarget(null);
        } catch {
            showToast("Failed to delete review", "error");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Review Moderation</h1>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-1">Filter by rating:</span>
                <button
                    onClick={() => setRatingFilter(0)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${ratingFilter === 0 ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                >
                    All
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRatingFilter(star)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 ${ratingFilter === star ? "bg-amber-400 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                    >
                        <FiStar className="w-3.5 h-3.5" /> {star}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {loading ? (
                    <div className="p-6"><TableSkeleton rows={5} /></div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FiMessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No reviews found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-left">
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Product</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">User</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Rating</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Comment</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((review) => (
                                    <tr key={review._id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="p-4 font-medium text-gray-900 dark:text-white max-w-[180px] truncate">{review.productName}</td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300">{review.user?.name || "Anonymous"}</td>
                                        <td className="p-4"><StarRating rating={review.rating} size="sm" /></td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 max-w-[300px] truncate">{review.comment}</td>
                                        <td className="p-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatDate(review.createdAt)}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setDeleteTarget({ reviewId: review._id!, productId: review.productId })}
                                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition"
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

            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Review" size="sm">
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Are you sure you want to delete this review? This cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={deleteReview} className="px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition">Delete</button>
                </div>
            </Modal>
        </div>
    );
}
