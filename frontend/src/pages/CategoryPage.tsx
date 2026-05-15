import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiGrid, FiAlertCircle } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import { categoryApi } from "../api";
import type { ICategory } from "../types";
import EmptyState from "../components/ui/EmptyState";

const GRADIENTS = [
    "from-blue-500 to-purple-600",
    "from-purple-500 to-pink-600",
    "from-pink-500 to-rose-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-cyan-500 to-blue-600",
    "from-rose-500 to-red-600",
    "from-teal-500 to-emerald-600",
    "from-indigo-500 to-purple-600",
    "from-orange-500 to-red-600",
    "from-green-500 to-emerald-600",
    "from-violet-500 to-indigo-600",
];

const ICONS = [
    "🛍️", "📱", "👗", "🏠", "💄", "⌚", "👟", "📚", "🎮", "🎵", "🏋️", "🎨"
];

export default function CategoryPage() {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        categoryApi.getAll()
            .then(res => setCategories(res.data))
            .catch(err => setError(err?.response?.data?.message || "Failed to load categories"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 mx-auto" />
                        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded mb-12 mx-auto" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <EmptyState
                    icon={<FiAlertCircle className="w-8 h-8" />}
                    title="Failed to load categories"
                    description={error}
                    actionText="Try Again"
                    onAction={() => window.location.reload()}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                        <HiOutlineSparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Browse Categories</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Shop by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Explore our wide range of categories and find exactly what you're looking for
                    </p>
                </div>

                {categories.length === 0 ? (
                    <EmptyState
                        icon={<FiGrid className="w-8 h-8" />}
                        title="No categories available"
                        description="Categories will appear here once they are added"
                        actionText="Back to Home"
                        actionLink="/"
                    />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((category, index) => {
                            const gradient = GRADIENTS[index % GRADIENTS.length];
                            const icon = ICONS[index % ICONS.length];
                            return (
                                <Link
                                    key={category._id}
                                    to={`/shop?category=${category._id}`}
                                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
                                >
                                    <div className={`h-48 bg-gradient-to-br ${gradient} p-6 flex flex-col justify-between relative`}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

                                        <div className="relative">
                                            <span className="text-4xl">{icon}</span>
                                        </div>

                                        <div className="relative">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                                                {category.name}
                                            </h3>
                                            <div className="flex items-center text-white/80 text-sm font-medium">
                                                <span>Explore Collection</span>
                                                <FiArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
