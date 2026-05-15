import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";
import { useDebounce } from "../hooks/useDebounce";
import { categoryApi, productApi } from "../api";
import type { ICategory } from "../types";
import { FiMenu, FiX, FiUser, FiShoppingCart, FiSearch, FiHeart, FiChevronDown, FiMoon, FiSun, FiLogOut, FiGrid, FiPackage, FiSettings } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuthStore();
    const { cartCount } = useCartStore();
    const { theme, toggleTheme, setCartDrawerOpen } = useUIStore();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<{ _id: string; name: string }[]>([]);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const debouncedSearch = useDebounce(searchQuery, 300);

    useEffect(() => {
        categoryApi.getAll().then((res) => setCategories(res.data)).catch(() => {});
    }, []);

    useEffect(() => {
        if (debouncedSearch.length < 2) {
            setSuggestions([]);
            return;
        }
        productApi.getAll({ search: debouncedSearch, limit: 5 }).then((res) => {
            setSuggestions(res.data.products.map((p: any) => ({ _id: p._id, name: p.name })));
        }).catch(() => {});
    }, [debouncedSearch]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (id: string) => {
        navigate(`/product/${id}`);
        setSearchQuery("");
        setShowSuggestions(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 group shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity" />
                            <HiOutlineShoppingBag className="relative w-8 h-8 text-blue-600 dark:text-blue-400 group-hover:text-purple-600 transition-all group-hover:scale-110" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            LuxeCart
                        </h1>
                    </Link>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl relative">
                        <div className="relative w-full">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                placeholder="Search products..."
                                className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 transition outline-none dark:text-white"
                            />
                        </div>
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                                {suggestions.map((s) => (
                                    <button key={s._id} type="button" onMouseDown={() => selectSuggestion(s._id)} className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm dark:text-white">
                                        {s.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>

                    {/* Desktop Nav Links */}
                    <div className="hidden lg:flex items-center space-x-1">
                        <Link to="/" className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            Home
                        </Link>
                        <div className="relative">
                            <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="flex items-center px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                                Categories <FiChevronDown className={`ml-1 w-4 h-4 transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                            </button>
                        </div>
                        <Link to="/shop" className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                            Shop
                        </Link>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden lg:flex items-center space-x-2">
                        <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-600 dark:text-gray-400">
                            {theme === "dark" ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                        </button>

                        <button onClick={() => setCartDrawerOpen(true)} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative group">
                            <FiShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-colors" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                    {cartCount > 99 ? "99+" : cartCount}
                                </span>
                            )}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative">
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden xl:block">{user?.name?.split(" ")[0]}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                <p className="text-sm font-semibold dark:text-white">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>
                                            <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition dark:text-gray-300">
                                                <FiGrid className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <Link to="/dashboard/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition dark:text-gray-300">
                                                <FiPackage className="w-4 h-4" /> Orders
                                            </Link>
                                            {isAdmin && (
                                                <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition text-purple-600 font-semibold">
                                                    <FiSettings className="w-4 h-4" /> Admin Panel
                                                </Link>
                                            )}
                                            <div className="border-t border-gray-100 dark:border-gray-700">
                                                <button onClick={() => { setIsUserMenuOpen(false); logout(); }} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition w-full">
                                                    <FiLogOut className="w-4 h-4" /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition shadow-md hover:shadow-lg text-sm">
                                <FiUser className="w-4 h-4" /> <span>Sign In</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center space-x-2">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            {theme === "dark" ? <FiSun className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <FiMoon className="w-5 h-5 text-gray-600" />}
                        </button>
                        <button onClick={() => setCartDrawerOpen(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative">
                            <FiShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                        </button>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            {isMenuOpen ? <FiX className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <FiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="lg:hidden mt-3">
                        <form onSubmit={handleSearch}>
                            <div className="relative">
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." className="w-full pl-12 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 outline-none dark:text-white" autoFocus />
                            </div>
                        </form>
                    </div>
                )}

                {/* Mobile Search Toggle */}
                <div className="lg:hidden mt-3">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <FiSearch className="w-5 h-5" /> Search products...
                    </button>
                </div>
            </div>

            {/* Categories Dropdown */}
            {isCategoryOpen && (
                <div className="hidden lg:block absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shadow-xl z-40">
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.slice(0, 8).map((cat) => (
                                <Link key={cat._id} to={`/shop?category=${cat._id}`} onClick={() => setIsCategoryOpen(false)}
                                    className="block p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition group">
                                    <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 transition">{cat.name}</h3>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
                            <Link to="/categories" onClick={() => setIsCategoryOpen(false)} className="text-blue-600 font-semibold hover:underline">View All Categories →</Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-16 bg-white dark:bg-gray-900 z-40 overflow-y-auto">
                    <div className="container mx-auto px-4 py-6 space-y-4">
                        {isAuthenticated ? (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 dark:text-white">{user?.name}</p>
                                        <p className="text-sm text-gray-500">{user?.email}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 border border-gray-100 dark:border-gray-700">
                                <p className="font-semibold text-gray-800 dark:text-white">Welcome Guest!</p>
                                <p className="text-sm text-gray-500">Sign in for personalized experience</p>
                            </div>
                        )}

                        <div className="space-y-1">
                            <MobileNavLink to="/" icon={FiGrid} label="Home" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/shop" icon={FiPackage} label="Shop All" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/categories" icon={FiGrid} label="Categories" onClick={() => setIsMenuOpen(false)} />
                            <MobileNavLink to="/dashboard/wishlist" icon={FiHeart} label="Wishlist" onClick={() => setIsMenuOpen(false)} />
                        </div>

                        {isAuthenticated && (
                            <>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Account</p>
                                    <div className="space-y-1">
                                        <MobileNavLink to="/dashboard" icon={FiGrid} label="Dashboard" onClick={() => setIsMenuOpen(false)} />
                                        <MobileNavLink to="/dashboard/orders" icon={FiPackage} label="Orders" onClick={() => setIsMenuOpen(false)} />
                                        <MobileNavLink to="/dashboard/profile" icon={FiUser} label="Profile" onClick={() => setIsMenuOpen(false)} />
                                        {isAdmin && <MobileNavLink to="/admin" icon={FiSettings} label="Admin Panel" onClick={() => setIsMenuOpen(false)} />}
                                    </div>
                                </div>
                                <button onClick={() => { setIsMenuOpen(false); logout(); }} className="flex items-center gap-3 w-full p-4 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition font-semibold">
                                    <FiLogOut className="w-5 h-5" /> Sign Out
                                </button>
                            </>
                        )}

                        {!isAuthenticated && (
                            <div className="pt-4 space-y-3">
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block w-full py-3.5 text-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition shadow-md">
                                    Sign In
                                </Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full py-3 text-center rounded-xl border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold transition">
                                    Create Account
                                </Link>
                            </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-center text-gray-500 text-sm">Need help? <span className="text-blue-600 font-semibold">support@luxecart.com</span></p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

function MobileNavLink({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick: () => void }) {
    return (
        <Link to={to} onClick={onClick}
            className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition group">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
            <span className="font-semibold text-gray-800 dark:text-gray-200">{label}</span>
        </Link>
    );
}
