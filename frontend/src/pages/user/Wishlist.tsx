import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2, FiStar } from "react-icons/fi";
import { wishlistApi } from "../../api";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../hooks/useToast";
import { ProductCardSkeleton } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";

export default function UserWishlist() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const fetchWishlist = () => {
        wishlistApi.get()
            .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchWishlist(); }, []);

    const handleRemove = async (productId: string) => {
        try {
            await wishlistApi.remove(productId);
            setItems((prev) => prev.filter((i: any) => i._id !== productId));
            showToast("Removed from wishlist", "success");
        } catch { showToast("Failed to remove", "error"); }
    };

    if (loading) return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <ProductCardSkeleton key={i} />)}</div>;

    if (items.length === 0) {
        return <EmptyState icon={<FiHeart className="w-10 h-10" />} title="Your wishlist is empty" description="Save your favorite items here" actionText="Browse Products" actionLink="/shop" />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Wishlist ({items.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product: any) => (
                    <div key={product._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition">
                        <Link to={`/product/${product._id}`}>
                            <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                    <FiHeart className="w-16 h-16 text-gray-300" />
                                )}
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/product/${product._id}`} className="text-sm font-semibold text-gray-800 dark:text-white hover:text-blue-600 transition block truncate">{product.name}</Link>
                            <div className="flex items-center gap-1 mt-1 mb-2">
                                {[1,2,3,4,5].map((s) => (
                                    <FiStar key={s} className={`w-3.5 h-3.5 ${s <= Math.round(product.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">({product.reviewCount || 0})</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div>
                                    <span className="text-lg font-bold text-gray-800 dark:text-white">Rs.{product.finalPrice || product.price}</span>
                                    {product.finalPrice < product.price && (
                                        <span className="ml-2 text-sm text-gray-400 line-through">Rs.{product.price}</span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleRemove(product._id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 hover:text-red-600 transition" title="Remove">
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => { addToCart(product._id); showToast("Added to cart", "success"); }} className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 hover:text-blue-600 transition" title="Add to Cart">
                                        <FiShoppingCart className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
