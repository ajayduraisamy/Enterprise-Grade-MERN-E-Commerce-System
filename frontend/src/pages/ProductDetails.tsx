import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiStar, FiHeart, FiShoppingCart, FiShare2, FiMinus, FiPlus, FiTruck, FiRefreshCw, FiCheck, FiMessageSquare } from "react-icons/fi";
import { HiOutlineBadgeCheck, HiOutlineSparkles } from "react-icons/hi";
import { productApi, reviewApi } from "../api";
import type { IProduct, IReview, IPagination } from "../types";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";

function formatPrice(price: number) {
    return "₹" + price.toLocaleString("en-IN");
}

function getDiscountPercent(price: number, finalPrice: number) {
    return Math.round(((price - finalPrice) / price) * 100);
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function getDeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" });
}

const TABS = ["Description", "Reviews", "Shipping & Returns"] as const;
type Tab = typeof TABS[number];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlist();
    const { showToast } = useToast();

    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [tab, setTab] = useState<Tab>("Description");
    const [addingToCart, setAddingToCart] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    const [reviews, setReviews] = useState<IReview[]>([]);
    const [reviewPagination, setReviewPagination] = useState<IPagination>({ page: 1, limit: 5, total: 0, totalPages: 1 });
    const [reviewPage, setReviewPage] = useState(1);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);

    const [copied, setCopied] = useState(false);

    useEffect(() => { fetchWishlist(); }, []);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError("");
        productApi.getById(id)
            .then(res => {
                setProduct(res.data.product);
                setSelectedImage(0);
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch(err => setError(err?.response?.data?.message || "Product not found"))
            .finally(() => setLoading(false));
    }, [id]);

    useEffect(() => {
        if (!id) return;
        setReviewsLoading(true);
        reviewApi.getProductReviews(id, reviewPage, 5)
            .then(res => {
                setReviews(res.data.reviews);
                setReviewPagination(res.data.pagination);
            })
            .catch(() => setReviews([]))
            .finally(() => setReviewsLoading(false));
    }, [id, reviewPage]);

    useEffect(() => {
        if (!product) return;
        setRelatedLoading(true);
        productApi.getAll({ category: (product.category as any)?._id || product.category, limit: 5 })
            .then(res => {
                setRelatedProducts(res.data.products.filter(p => p._id !== product._id).slice(0, 4));
            })
            .catch(() => setRelatedProducts([]))
            .finally(() => setRelatedLoading(false));
    }, [product]);

    const handleAddToCart = async () => {
        if (!product) return;
        setAddingToCart(true);
        const ok = await addToCart(product._id, quantity);
        if (ok) {
            showToast(`${product.name} added to cart!`, "success");
            setQuantity(1);
        } else {
            showToast("Failed to add to cart", "error");
        }
        setAddingToCart(false);
    };

    const handleBuyNow = async () => {
        if (!product) return;
        const ok = await addToCart(product._id, quantity);
        if (ok) {
            showToast("Redirecting to checkout...", "success");
        } else {
            showToast("Failed to process", "error");
        }
    };

    const handleWishlistToggle = async () => {
        if (!product) return;
        if (isInWishlist(product._id)) {
            await removeFromWishlist(product._id);
            showToast("Removed from wishlist");
        } else {
            await addToWishlist(product._id);
            showToast("Added to wishlist!", "success");
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            showToast("Link copied!", "success");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            showToast("Failed to copy link", "error");
        }
    };

    const handleSubmitReview = async () => {
        if (!id || !newRating || !newComment.trim()) {
            showToast("Please provide a rating and comment", "warning");
            return;
        }
        setSubmittingReview(true);
        try {
            await reviewApi.add(id, newRating, newComment);
            showToast("Review submitted!", "success");
            setNewRating(0);
            setNewComment("");
            reviewApi.getProductReviews(id, 1, 5).then(res => {
                setReviews(res.data.reviews);
                setReviewPagination(res.data.pagination);
                setReviewPage(1);
            });
        } catch {
            showToast("Failed to submit review", "error");
        }
        setSubmittingReview(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse space-y-8">
                        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                            <div className="space-y-4">
                                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-6 w-1/4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-20 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <EmptyState
                    icon={<FiStar className="w-8 h-8" />}
                    title="Product not found"
                    description={error || "The product you're looking for doesn't exist"}
                    actionText="Back to Shop"
                    actionLink="/shop"
                />
            </div>
        );
    }

    const images = product.images?.length ? product.images : [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
                    <span>/</span>
                    <Link to={`/shop?category=${(product.category as any)?._id || ""}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                        {(product.category as any)?.name || "Category"}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white font-medium truncate">{product.name}</span>
                </nav>

                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div
                            className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg cursor-crosshair"
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                            onMouseMove={handleMouseMove}
                        >
                            {images[selectedImage] ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className={`w-full h-80 md:h-96 lg:h-[28rem] object-cover transition-transform duration-200 ${
                                        zoomed ? "scale-150" : "scale-100"
                                    }`}
                                    style={zoomed ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
                                />
                            ) : (
                                <div className="w-full h-80 md:h-96 lg:h-[28rem] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                    <FiShoppingCart className="w-24 h-24 text-gray-400 dark:text-gray-500" />
                                </div>
                            )}
                            {product.finalPrice < product.price && (
                                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-rose-500 text-white text-sm font-bold shadow-lg">
                                    -{getDiscountPercent(product.price, product.finalPrice)}%
                                </span>
                            )}
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                                            i === selectedImage
                                                ? "border-blue-500 shadow-md"
                                                : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-5">
                        <div>
                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <FiStar key={s} className={`w-5 h-5 ${s <= Math.round(product.averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {product.averageRating.toFixed(1)}
                                </span>
                                <button onClick={() => setTab("Reviews")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                    ({product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""})
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(product.finalPrice)}
                            </span>
                            {product.finalPrice < product.price && (
                                <>
                                    <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-bold">
                                        Save {formatPrice(product.price - product.finalPrice)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* SubCategory offer */}
                        {(product.subCategory as any)?.offerPercent && (
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                                <HiOutlineSparkles className="w-5 h-5 text-amber-500" />
                                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                                    Special offer: {(product.subCategory as any).offerPercent}% off on {(product.subCategory as any).name}
                                </span>
                            </div>
                        )}

                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {product.description}
                        </p>

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            {product.stock > 0 ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                                    <FiCheck className="w-4 h-4" />
                                    In Stock ({product.stock} available)
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-sm font-medium">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Qty:</span>
                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                                >
                                    <FiMinus className="w-4 h-4" />
                                </button>
                                <span className="w-14 text-center font-semibold text-gray-900 dark:text-white border-x border-gray-300 dark:border-gray-600 py-2.5">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    disabled={quantity >= product.stock}
                                    className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                                >
                                    <FiPlus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className={`flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                                    product.stock === 0
                                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 hover:shadow-xl active:scale-[0.98]"
                                }`}
                            >
                                {addingToCart ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <FiShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border-2 border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 active:scale-[0.98]"
                            >
                                <FiShoppingCart className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>

                        {/* Wishlist & Share */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleWishlistToggle}
                                className={`flex-1 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 border transition-all ${
                                    isInWishlist(product._id)
                                        ? "border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                                        : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                            >
                                <FiHeart className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-rose-500" : ""}`} />
                                {isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                            </button>
                            <button
                                onClick={handleShare}
                                className="py-2.5 px-5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2 text-sm font-medium"
                            >
                                {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiShare2 className="w-4 h-4" />}
                                Share
                            </button>
                        </div>

                        {/* Delivery */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800">
                            <div className="flex items-center gap-3">
                                <FiTruck className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">Free Delivery</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Estimated delivery by <span className="font-medium text-gray-700 dark:text-gray-300">{getDeliveryDate()}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-12">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
                        {TABS.map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-6 py-3.5 text-sm font-semibold whitespace-nowrap transition border-b-2 ${
                                    tab === t
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                }`}
                            >
                                {t}
                                {t === "Reviews" && (
                                    <span className="ml-1.5 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-xs">
                                        {product.reviewCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Description Tab */}
                    {tab === "Description" && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
                            <div className="prose prose-gray dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Price", value: formatPrice(product.price) },
                                    { label: "Final Price", value: formatPrice(product.finalPrice) },
                                    { label: "Category", value: (product.category as any)?.name || "N/A" },
                                    { label: "Stock", value: `${product.stock} units` },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews Tab */}
                    {tab === "Reviews" && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Rating Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-24">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Customer Reviews</h3>
                                    <div className="text-center mb-6">
                                        <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                            {product.averageRating.toFixed(1)}
                                        </div>
                                        <div className="flex items-center justify-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <FiStar key={s} className={`w-5 h-5 ${s <= Math.round(product.averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{product.reviewCount} reviews</p>
                                    </div>

                                    {/* Rating Bars */}
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = reviews.filter(r => Math.round(r.rating) === star).length;
                                        const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 mb-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{star}★</span>
                                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-right">{count}</span>
                                            </div>
                                        );
                                    })}

                                    {/* Add Review */}
                                    {user && (
                                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-3">Write a Review</h4>
                                            <div className="flex items-center gap-1 mb-3">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <button key={s} type="button" onClick={() => setNewRating(s)} className="transition-transform hover:scale-110">
                                                        <FiStar className={`w-6 h-6 ${s <= newRating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                placeholder="Share your thoughts..."
                                                value={newComment}
                                                onChange={e => setNewComment(e.target.value)}
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                            />
                                            <button
                                                onClick={handleSubmitReview}
                                                disabled={submittingReview || !newRating || !newComment.trim()}
                                                className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-sm hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {submittingReview ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review List */}
                            <div className="lg:col-span-2">
                                {reviewsLoading ? (
                                    <div className="space-y-4">
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
                                                <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                                                <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                                                <div className="h-16 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                                            </div>
                                        ))}
                                    </div>
                                ) : reviews.length === 0 ? (
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                                        <FiMessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">No reviews yet</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to review this product</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reviews.map((review, i) => (
                                            <div key={review._id || i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {review.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{review.user.name}</p>
                                                            <div className="flex items-center gap-0.5 mt-0.5">
                                                                {[1, 2, 3, 4, 5].map(s => (
                                                                    <FiStar key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{formatDate(review.createdAt)}</span>
                                                </div>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{review.comment}</p>
                                                <div className="mt-2">
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                                                        <HiOutlineBadgeCheck className="w-3 h-3" />
                                                        Verified Purchase
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <Pagination
                                            page={reviewPagination.page}
                                            totalPages={reviewPagination.totalPages}
                                            onPageChange={setReviewPage}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shipping & Returns Tab */}
                    {tab === "Shipping & Returns" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <FiTruck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Shipping Policy</h3>
                                </div>
                                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                                    <p>We offer free shipping on all orders above ₹499. Standard delivery takes 3-5 business days.</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Free shipping on orders above ₹499</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Standard delivery: 3-5 business days</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Express delivery available at ₹99 (1-2 business days)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>All orders are tracked with real-time updates</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Shipping to all major cities and towns across India</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                        <FiRefreshCw className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Return Policy</h3>
                                </div>
                                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                                    <p>We want you to love your purchase. If you're not satisfied, we offer a hassle-free return policy.</p>
                                    <ul className="space-y-2">
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>30-day return window from delivery date</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Free pick-up for returns within 7 days</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Full refund to original payment method</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Products must be unused and in original packaging</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <span>Refund processed within 5-7 business days of pickup</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Related Products */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Related Products</h2>
                        <Link to="/shop" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            View All
                        </Link>
                    </div>
                    {relatedLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : relatedProducts.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">No related products found</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(rp => (
                                <Link key={rp._id} to={`/product/${rp._id}`} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                    <div className="relative overflow-hidden">
                                        {rp.images?.[0] ? (
                                            <img src={rp.images[0]} alt={rp.name} className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                                        ) : (
                                            <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
                                                <FiShoppingCart className="w-10 h-10 text-gray-400" />
                                            </div>
                                        )}
                                        {rp.finalPrice < rp.price && (
                                            <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-rose-500 text-white text-xs font-bold">
                                                -{getDiscountPercent(rp.price, rp.finalPrice)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {rp.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <FiStar key={s} className={`w-3 h-3 ${s <= Math.round(rp.averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">({rp.reviewCount})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 dark:text-white">{formatPrice(rp.finalPrice)}</span>
                                            {rp.finalPrice < rp.price && (
                                                <span className="text-xs text-gray-400 line-through">{formatPrice(rp.price)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
