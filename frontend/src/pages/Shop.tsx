import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiX, FiGrid, FiList, FiHeart, FiShoppingCart, FiStar, FiChevronDown, FiPackage, FiAlertCircle } from "react-icons/fi";
import { HiOutlineAdjustments, HiOutlineFilter } from "react-icons/hi";
import { productApi, categoryApi, subCategoryApi } from "../api";
import type { IProduct, ICategory, ISubCategory, IPagination, IProductFilters } from "../types";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useToast } from "../hooks/useToast";
import { useDebounce } from "../hooks/useDebounce";
import Pagination from "../components/ui/Pagination";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

const GRADIENT_BG = "bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30";

function formatPrice(price: number) {
    return "₹" + price.toLocaleString("en-IN");
}

function getDiscountPercent(price: number, finalPrice: number) {
    return Math.round(((price - finalPrice) / price) * 100);
}

function isNewProduct(createdAt: string) {
    const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days < 7;
}

interface FilterChip {
    label: string;
    onRemove: () => void;
}

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist } = useWishlist();
    const { showToast } = useToast();

    const [products, setProducts] = useState<IProduct[]>([]);
    const [pagination, setPagination] = useState<IPagination>({ page: 1, limit: 12, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [categories, setCategories] = useState<ICategory[]>([]);
    const [subCategories, setSubCategories] = useState<ISubCategory[]>([]);

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const debouncedSearch = useDebounce(search, 300);
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [selectedSubCategory, setSelectedSubCategory] = useState(searchParams.get("subCategory") || "");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [selectedRating, setSelectedRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sort, setSort] = useState("newest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);

    useEffect(() => { fetchWishlist(); }, []);

    useEffect(() => {
        categoryApi.getAll().then(res => setCategories(res.data)).catch(() => {});
        subCategoryApi.getAll().then(res => setSubCategories(res.data)).catch(() => {});
    }, []);

    const filteredSubCategories = subCategories.filter(sc => {
        const catId = typeof sc.category === "string" ? sc.category : sc.category?._id;
        return catId === selectedCategory;
    });

    const buildFilters = useCallback((): IProductFilters => {
        const filters: IProductFilters = {};
        if (debouncedSearch) filters.search = debouncedSearch;
        if (selectedCategory) filters.category = selectedCategory;
        if (selectedSubCategory) filters.subCategory = selectedSubCategory;
        if (minPrice) filters.minPrice = Number(minPrice);
        if (maxPrice) filters.maxPrice = Number(maxPrice);
        if (selectedRating) filters.rating = selectedRating;
        if (inStockOnly) filters.inStock = true;
        if (sort) filters.sort = sort;
        filters.page = page;
        filters.limit = 12;
        return filters;
    }, [debouncedSearch, selectedCategory, selectedSubCategory, minPrice, maxPrice, selectedRating, inStockOnly, sort, page]);

    useEffect(() => {
        setLoading(true);
        setError("");
        const filters = buildFilters();
        productApi.getAll(filters)
            .then(res => {
                setProducts(res.data.products);
                setPagination(res.data.pagination);
            })
            .catch(err => {
                setError(err?.response?.data?.message || "Failed to load products");
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [buildFilters]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedSubCategory) params.set("subCategory", selectedSubCategory);
        setSearchParams(params, { replace: true });
    }, [debouncedSearch, selectedCategory, selectedSubCategory]);

    const handleAddToCart = async (productId: string) => {
        setAddingToCart(productId);
        const ok = await addToCart(productId);
        if (ok) showToast("Added to cart!", "success");
        else showToast("Failed to add to cart", "error");
        setAddingToCart(null);
    };

    const handleWishlistToggle = async (productId: string) => {
        if (isInWishlist(productId)) {
            await removeFromWishlist(productId);
            showToast("Removed from wishlist");
        } else {
            await addToWishlist(productId);
            showToast("Added to wishlist!", "success");
        }
    };

    const clearAllFilters = () => {
        setSearch("");
        setSelectedCategory("");
        setSelectedSubCategory("");
        setMinPrice("");
        setMaxPrice("");
        setSelectedRating(0);
        setInStockOnly(false);
        setSort("newest");
        setPage(1);
    };

    const chips: FilterChip[] = [];
    if (debouncedSearch) chips.push({ label: `"${debouncedSearch}"`, onRemove: () => { setSearch(""); setPage(1); } });
    if (selectedCategory) {
        const cat = categories.find(c => c._id === selectedCategory);
        chips.push({ label: cat?.name || "Category", onRemove: () => { setSelectedCategory(""); setSelectedSubCategory(""); setPage(1); } });
    }
    if (selectedSubCategory) {
        const sub = subCategories.find(s => s._id === selectedSubCategory);
        chips.push({ label: sub?.name || "SubCategory", onRemove: () => { setSelectedSubCategory(""); setPage(1); } });
    }
    if (minPrice || maxPrice) chips.push({ label: `₹${minPrice || "0"} - ₹${maxPrice || "∞"}`, onRemove: () => { setMinPrice(""); setMaxPrice(""); setPage(1); } });
    if (selectedRating) chips.push({ label: `${selectedRating}★ & up`, onRemove: () => { setSelectedRating(0); setPage(1); } });
    if (inStockOnly) chips.push({ label: "In Stock", onRemove: () => { setInStockOnly(false); setPage(1); } });

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <FiStar key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
            ))}
        </div>
    );

    const renderProductCard = (product: IProduct) => (
        <div
            key={product._id}
            className={`group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${viewMode === "list" ? "flex flex-row" : ""}`}
        >
            <div className={`relative overflow-hidden ${viewMode === "list" ? "w-48 shrink-0" : ""}`}>
                <Link to={`/product/${product._id}`}>
                    {product.images?.[0] ? (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${viewMode === "list" ? "h-40" : "h-48 md:h-56"}`}
                            loading="lazy"
                        />
                    ) : (
                        <div className={`${viewMode === "list" ? "h-40" : "h-48 md:h-56"} ${GRADIENT_BG} flex items-center justify-center`}>
                            <FiPackage className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        </div>
                    )}
                </Link>

                {isNewProduct(product.createdAt) && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-lg">
                        New
                    </span>
                )}
                {product.finalPrice < product.price && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-rose-500 text-white text-xs font-bold shadow-lg">
                        -{getDiscountPercent(product.price, product.finalPrice)}%
                    </span>
                )}
                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-bold">Out of Stock</span>
                    </div>
                )}

                <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                        isInWishlist(product._id)
                            ? "bg-rose-500 text-white"
                            : "bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                    }`}
                >
                    <FiHeart className={`w-4 h-4 ${isInWishlist(product._id) ? "fill-white" : ""}`} />
                </button>
            </div>

            <div className={`p-4 md:p-5 flex flex-col flex-1 ${viewMode === "list" ? "justify-center" : ""}`}>
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm md:text-base leading-tight mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2 mb-2">
                    {renderStars(product.averageRating)}
                    <span className="text-xs text-gray-500 dark:text-gray-400">({product.reviewCount})</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(product.finalPrice)}</span>
                    {product.finalPrice < product.price && (
                        <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatPrice(product.price)}</span>
                    )}
                </div>

                {viewMode === "list" && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                )}

                <div className="mt-auto">
                    <button
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0 || addingToCart === product._id}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                            product.stock === 0
                                ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-md hover:shadow-lg"
                        }`}
                    >
                        {addingToCart === product._id ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <FiShoppingCart className="w-4 h-4" />
                                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderSidebarFilters = () => (
        <div className="space-y-6">
            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Categories</h4>
                <div className="space-y-1">
                    <button
                        onClick={() => { setSelectedCategory(""); setSelectedSubCategory(""); setPage(1); }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                            !selectedCategory
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                        }`}
                    >
                        All Categories
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat._id}
                            onClick={() => { setSelectedCategory(cat._id); setSelectedSubCategory(""); setPage(1); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                selectedCategory === cat._id
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {selectedCategory && filteredSubCategories.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Subcategories</h4>
                    <div className="space-y-1">
                        <button
                            onClick={() => { setSelectedSubCategory(""); setPage(1); }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                !selectedSubCategory
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                            All
                        </button>
                        {filteredSubCategories.map(sub => (
                            <button
                                key={sub._id}
                                onClick={() => { setSelectedSubCategory(sub._id); setPage(1); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                                    selectedSubCategory === sub._id
                                        ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                }`}
                            >
                                {sub.name}
                                {sub.offerPercent ? <span className="ml-2 text-xs text-emerald-500">({sub.offerPercent}% off)</span> : null}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Price Range</h4>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={e => { setMinPrice(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={e => { setMaxPrice(e.target.value); setPage(1); }}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Rating</h4>
                <div className="space-y-1">
                    {[4, 3, 2, 1].map(r => (
                        <button
                            key={r}
                            onClick={() => { setSelectedRating(selectedRating === r ? 0 : r); setPage(1); }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                                selectedRating === r
                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                            }`}
                        >
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <FiStar key={s} className={`w-3.5 h-3.5 ${s <= r ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                                ))}
                            </div>
                            <span className="text-xs">& up</span>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={e => { setInStockOnly(e.target.checked); setPage(1); }}
                            className="sr-only peer"
                        />
                        <div className="w-10 h-6 rounded-full bg-gray-300 dark:bg-gray-600 peer-checked:bg-blue-500 transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow peer-checked:translate-x-4 transition-transform" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Stock Only</span>
                </label>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            Shop All Products
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {loading ? "Loading..." : `${pagination.total} product${pagination.total !== 1 ? "s" : ""} found`}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFilterDrawerOpen(true)}
                            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm"
                        >
                            <HiOutlineFilter className="w-5 h-5" />
                            Filters
                        </button>
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={e => { setSort(e.target.value); setPage(1); }}
                                className="appearance-none px-4 py-2.5 pr-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
                            >
                                <option value="newest">Newest</option>
                                <option value="price_asc">Price: Low - High</option>
                                <option value="price_desc">Price: High - Low</option>
                                <option value="rating">Rating</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <div className="hidden sm:flex items-center bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm overflow-hidden">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2.5 transition ${viewMode === "grid" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            >
                                <FiGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2.5 transition ${viewMode === "list" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"}`}
                            >
                                <FiList className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                    />
                    {search && (
                        <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-4 top-1/2 -translate-y-1/2">
                            <FiX className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                    )}
                </div>

                {/* Filter Chips */}
                {chips.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Filters:</span>
                        {chips.map((chip, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
                            >
                                {chip.label}
                                <button onClick={chip.onRemove} className="hover:text-blue-900 dark:hover:text-blue-100">
                                    <FiX className="w-3.5 h-3.5" />
                                </button>
                            </span>
                        ))}
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-64 lg:w-72 shrink-0">
                        <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2">
                                    <HiOutlineAdjustments className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                    <span className="font-bold text-gray-900 dark:text-white">Filters</span>
                                </div>
                                {chips.length > 0 && (
                                    <button onClick={clearAllFilters} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                        Reset
                                    </button>
                                )}
                            </div>
                            {renderSidebarFilters()}
                        </div>
                    </aside>

                    {/* Mobile Filter Drawer */}
                    {filterDrawerOpen && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setFilterDrawerOpen(false)} />
                            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl animate-slideInLeft overflow-y-auto">
                                <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <HiOutlineAdjustments className="w-5 h-5" />
                                        <span className="font-bold text-gray-900 dark:text-white">Filters</span>
                                    </div>
                                    <button
                                        onClick={() => setFilterDrawerOpen(false)}
                                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    {renderSidebarFilters()}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {error ? (
                            <EmptyState
                                icon={<FiAlertCircle className="w-8 h-8" />}
                                title="Something went wrong"
                                description={error}
                                actionText="Try Again"
                                onAction={() => window.location.reload()}
                            />
                        ) : loading ? (
                            <div className={viewMode === "grid"
                                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                                : "space-y-4"
                            }>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    viewMode === "grid" ? (
                                        <ProductCardSkeleton key={i} />
                                    ) : (
                                        <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg p-4 flex gap-4">
                                            <div className="w-40 h-36 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 w-3/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                                                <div className="h-4 w-1/2 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                                                <div className="h-6 w-1/4 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                                                <div className="h-10 w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <EmptyState
                                icon={<FiPackage className="w-8 h-8" />}
                                title="No products found"
                                description="Try adjusting your filters or search terms"
                                actionText="Clear Filters"
                                onAction={clearAllFilters}
                            />
                        ) : (
                            <>
                                <div className={viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6"
                                    : "space-y-4"
                                }>
                                    {products.map(renderProductCard)}
                                </div>
                                <Pagination
                                    page={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={setPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
