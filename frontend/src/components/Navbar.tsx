import { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { FiMenu, FiX, FiUser, FiShoppingCart, FiSearch, FiHeart, FiChevronDown } from "react-icons/fi";
import { HiOutlineShoppingBag } from "react-icons/hi";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
            

            {/* Main Navigation */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">

                    {/* Logo & Brand - More premium */}
                    <div className="flex items-center space-x-3">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                                <HiOutlineShoppingBag className="relative w-10 h-10 text-blue-600 group-hover:text-purple-600 transition-all duration-300 transform group-hover:scale-110" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full animate-pulse"></div>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    LuxeCart
                                </h1>
                                
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex items-center space-x-8 text-sm font-semibold">
                            <Link
                                to="/"
                                className="relative text-gray-700 hover:text-blue-600 transition-colors duration-300 group px-2 py-1"
                            >
                                <span className="flex items-center">
                                    Home
                                    <span className="ml-1 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                                </span>
                                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 group px-2 py-1"
                                >
                                    <span className="font-semibold">Categories</span>
                                    <FiChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                                </button>
                            </div>

                        
                            <Link
                                to="/new-arrivals"
                                className="relative px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 text-pink-600 hover:from-pink-100 hover:to-rose-100 transition-all duration-300 group"
                            >
                                <span className="flex items-center font-semibold text-sm">
                                    New Arrivals
                                    <span className="ml-2 w-2 h-2 bg-pink-500 rounded-full animate-ping opacity-75"></span>
                                </span>
                            </Link>

                            
                        </div>
                    </div>

                    {/* Desktop Search & Actions */}
                    <div className="hidden lg:flex items-center space-x-6">
                        {/* Desktop Search */}
                        <div className="w-80">
                            <SearchBar
                                value=""
                                onChange={() => { }}
                                className="rounded-full border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300"
                                placeholder="Search for  products..."
                            />
                        </div>

                        {/* Action Icons */}
                        <div className="flex items-center space-x-4">
                            
                            <Link
                                to="/cart"
                                className="p-2.5 rounded-full hover:bg-blue-50 transition-colors duration-300 group relative"
                            >
                                <FiShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                                    3
                                </span>
                            </Link>

                            <Link
                                to="/login"
                                className="flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                            >
                                <FiUser className="w-4 h-4" />
                                <span className="text-sm">Sign In</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex lg:hidden items-center space-x-3">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                            className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                        >
                            <FiSearch className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Cart Icon for Mobile */}
                        <Link
                            to="/cart"
                            className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-300 relative"
                        >
                            <FiShoppingCart className="w-5 h-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                                3
                            </span>
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-gray-200"
                        >
                            {isMenuOpen ? (
                                <FiX className="w-6 h-6 text-gray-700" />
                            ) : (
                                <FiMenu className="w-6 h-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search - Slides down */}
                {isSearchOpen && (
                    <div className="lg:hidden mt-4 animate-slideDown">
                        <SearchBar
                            value=""
                            onChange={() => { }}
                            className="w-full rounded-full border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 shadow-sm"
                            placeholder="Search products..."
                            autoFocus
                        />
                    </div>
                )}
            </div>

            {/* Categories Dropdown */}
            {isCategoryOpen && (
                <div className="hidden lg:block absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl animate-slideDown z-40">
                    <div className="container mx-auto px-4 py-6">
                        <div className="grid grid-cols-4 gap-8">
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Men's Fashion</h3>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Premium Watches</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Designer Apparel</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Footwear</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Accessories</a>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Women's Fashion</h3>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Luxury Bags</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Jewelry</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Cosmetics</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Evening Wear</a>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Electronics</h3>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Audio Gear</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Smart Home</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Gadgets</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Wearables</a>
                            </div>
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3">Featured</h3>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Limited Edition</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Summer Collection</a>
                                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Best Sellers</a>
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <Link to="/sale" className="inline-flex items-center text-pink-600 font-semibold hover:text-pink-700">
                                        Sale Up to 50% Off
                                        <span className="ml-2 text-xs">🔥</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-[86px] bg-white z-40 animate-slideDown overflow-y-auto">
                    <div className="container mx-auto px-4 py-6">
                        <div className="space-y-6">
                            {/* User Info */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-100">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                        GS
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Welcome Guest!</p>
                                        <p className="text-sm text-gray-600">Sign in for personalized experience</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile Navigation Links */}
                            <div className="space-y-2">
                                <Link
                                    to="/"
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="font-semibold text-gray-800">Home</span>
                                    </div>
                                    <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>

                                <Link
                                    to="/shop"
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="font-semibold text-gray-800">Shop All</span>
                                    </div>
                                    <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>

                                <Link
                                    to="/new-arrivals"
                                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors duration-300 group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-pink-500 group-hover:scale-150 transition-transform animate-pulse"></div>
                                        <span className="font-semibold text-pink-600">New Arrivals</span>
                                    </div>
                                    <span className="text-pink-400">🔥</span>
                                </Link>

                                <Link
                                    to="/categories"
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="font-semibold text-gray-800">Categories</span>
                                    </div>
                                    <span className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>

                                <Link
                                    to="/contact"
                                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors duration-300 group"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 group-hover:scale-150 transition-transform"></div>
                                        <span className="font-semibold text-gray-800">Contact Us</span>
                                    </div>
                                    <span className="text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </Link>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-2 gap-3 pt-4">
                                <Link
                                    to="/wishlist"
                                    className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-300 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiHeart className="w-6 h-6 text-pink-500 mx-auto mb-2" />
                                    <span className="font-semibold text-gray-800">Wishlist</span>
                                    <span className="block text-xs text-pink-600 font-bold">2 items</span>
                                </Link>

                                <Link
                                    to="/cart"
                                    className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 text-center"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <FiShoppingCart className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                                    <span className="font-semibold text-gray-800">Cart</span>
                                    <span className="block text-xs text-blue-600 font-bold">3 items</span>
                                </Link>
                            </div>

                            {/* Account Actions */}
                            <div className="pt-4 border-t border-gray-100 space-y-3">
                                <Link
                                    to="/login"
                                    className="block w-full py-3.5 text-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Sign In / Register
                                </Link>

                                <Link
                                    to="/account"
                                    className="block w-full py-3 text-center rounded-xl border-2 border-gray-200 hover:border-blue-400 text-gray-700 font-semibold transition-all duration-300"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Account
                                </Link>
                            </div>

                            {/* Contact Info */}
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-center text-gray-500 text-sm">
                                    Need help?
                                    <a href="tel:+18005551234" className="text-blue-600 font-semibold ml-1">1-800-555-1234</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}