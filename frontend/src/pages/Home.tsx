import { useState } from "react";
import { Link } from "react-router-dom";
import {
    FiArrowRight,
    FiStar,
    FiShoppingBag,
    FiTruck,
    FiShield,
    FiTag,
    FiClock,
    FiTrendingUp
} from "react-icons/fi";
import {
    HiOutlineFire,
    HiOutlineSparkles,
    HiOutlineBadgeCheck,
    HiOutlineShoppingCart
} from "react-icons/hi";

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("all");

    const categories = [
        { id: "all", name: "All Products", count: 125, color: "from-blue-500 to-purple-500" },
        { id: "electronics", name: "Electronics", count: 42, color: "from-purple-500 to-pink-500" },
        { id: "fashion", name: "Fashion", count: 36, color: "from-pink-500 to-rose-500" },
        { id: "home", name: "Home & Living", count: 28, color: "from-emerald-500 to-teal-500" },
        { id: "beauty", name: "Beauty", count: 19, color: "from-amber-500 to-orange-500" },
    ];

    const featuredProducts = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            price: "$299.99",
            originalPrice: "$399.99",
            rating: 4.8,
            imageColor: "bg-gradient-to-br from-blue-100 to-purple-100",
            tag: "Best Seller"
        },
        {
            id: 2,
            name: "Designer Leather Watch",
            price: "$459.99",
            originalPrice: "$599.99",
            rating: 4.9,
            imageColor: "bg-gradient-to-br from-amber-100 to-orange-100",
            tag: "Limited Edition"
        },
        {
            id: 3,
            name: "Smart Fitness Tracker",
            price: "$199.99",
            originalPrice: "$249.99",
            rating: 4.7,
            imageColor: "bg-gradient-to-br from-emerald-100 to-teal-100",
            tag: "New"
        },
        {
            id: 4,
            name: "Luxury Perfume Set",
            price: "$129.99",
            originalPrice: "$179.99",
            rating: 4.6,
            imageColor: "bg-gradient-to-br from-pink-100 to-rose-100",
            tag: "Sale"
        },
    ];

    const features = [
        {
            icon: <FiTruck className="w-6 h-6" />,
            title: "Free Shipping",
            description: "On all orders over $50",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <FiShield className="w-6 h-6" />,
            title: "Secure Payment",
            description: "100% secure transactions",
            color: "text-green-600 bg-green-50"
        },
        {
            icon: <HiOutlineBadgeCheck className="w-6 h-6" />,
            title: "Authentic Products",
            description: "Quality guaranteed",
            color: "text-purple-600 bg-purple-50"
        },
        {
            icon: <FiClock className="w-6 h-6" />,
            title: "24/7 Support",
            description: "Dedicated customer care",
            color: "text-amber-600 bg-amber-50"
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-white to-purple-50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between">
                        {/* Hero Content */}
                        <div className="lg:w-1/2 mb-12 lg:mb-0">
                            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 mb-6">
                                <HiOutlineSparkles className="w-4 h-4 text-blue-600 mr-2" />
                                <span className="text-sm font-semibold text-blue-700">Premium Shopping Experience</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Discover
                                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Luxury Products
                                </span>
                                Curated for You
                            </h1>

                            <p className="text-lg text-gray-600 mb-8 max-w-lg">
                                Explore our exclusive collection of premium products. Quality, style, and exceptional
                                service await you in every purchase.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    <span>Shop Now</span>
                                    <FiArrowRight className="ml-2 w-5 h-5" />
                                </Link>

                                <Link
                                    to="/new-arrivals"
                                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
                                >
                                    <HiOutlineFire className="mr-2 w-5 h-5" />
                                    <span>New Arrivals</span>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8 mt-12">
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10K+</div>
                                    <div className="text-sm text-gray-500">Happy Customers</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">500+</div>
                                    <div className="text-sm text-gray-500">Premium Brands</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">24/7</div>
                                    <div className="text-sm text-gray-500">Support</div>
                                </div>
                            </div>
                        </div>

                        {/* Hero Image/Illustration */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative">
                                {/* Main product card */}
                                <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
                                    <div className="absolute -top-4 -right-4">
                                        <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold">
                                            30% OFF
                                        </span>
                                    </div>

                                    <div className="w-64 h-64 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <HiOutlineShoppingCart className="w-20 h-20 text-blue-600 mx-auto mb-4" />
                                            <p className="text-gray-600">Premium Products</p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">Exclusive Collection</h3>
                                        <p className="text-gray-600 mb-4">Curated luxury items</p>
                                        <div className="flex items-center justify-center space-x-2 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FiStar key={star} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                            ))}
                                            <span className="text-gray-500 ml-2">(4.9)</span>
                                        </div>

                                        <div className="flex items-center justify-center space-x-4">
                                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                                From $99
                                            </span>
                                            <button className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
                                                Shop Now
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-2xl bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg flex items-center justify-center">
                                    <FiTrendingUp className="w-10 h-10 text-emerald-600" />
                                </div>

                                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-2xl bg-gradient-to-r from-pink-100 to-rose-100 shadow-lg flex items-center justify-center">
                                    <FiTag className="w-8 h-8 text-rose-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Shop by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Category</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Explore our carefully curated categories to find exactly what you're looking for.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category.id
                                        ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                {category.name}
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeCategory === category.id
                                        ? "bg-white/20"
                                        : "bg-gray-200"
                                    }`}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gradient-to-b from-white to-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">
                                Featured <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products</span>
                            </h2>
                            <p className="text-gray-600">Handpicked luxury items just for you</p>
                        </div>
                        <Link
                            to="/shop"
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            View All
                            <FiArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                            >
                                <div className="relative overflow-hidden">
                                    <div className={`h-48 ${product.imageColor} flex items-center justify-center`}>
                                        <FiShoppingBag className="w-16 h-16 text-white/50" />
                                    </div>

                                    {product.tag && (
                                        <div className="absolute top-4 left-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.tag === "Best Seller"
                                                    ? "bg-amber-500 text-white"
                                                    : product.tag === "Limited Edition"
                                                        ? "bg-purple-500 text-white"
                                                        : product.tag === "New"
                                                            ? "bg-emerald-500 text-white"
                                                            : "bg-pink-500 text-white"
                                                }`}>
                                                {product.tag}
                                            </span>
                                        </div>
                                    )}

                                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <HiOutlineShoppingCart className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>

                                    <div className="flex items-center mb-3">
                                        <div className="flex items-center mr-3">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FiStar
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= Math.floor(product.rating)
                                                            ? "text-amber-400 fill-amber-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500">{product.rating}</span>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-gray-800">{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="ml-2 text-sm text-gray-400 line-through">
                                                    {product.originalPrice}
                                                </span>
                                            )}
                                        </div>

                                        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">LuxeCart</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We're committed to providing you with the best shopping experience possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                            >
                                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>

                                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>

                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <span className="text-sm text-gray-400">Learn more →</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Experience Luxury Shopping?
                        </h2>
                        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of satisfied customers who trust us for their premium shopping needs.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300"
                            >
                                <span>Create Free Account</span>
                                <FiArrowRight className="ml-2 w-5 h-5" />
                            </Link>

                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30"
                            >
                                Browse Collections
                            </Link>
                        </div>

                        <div className="mt-8 text-blue-100 text-sm">
                            <p>No credit card required • 30-day return policy • Premium support included</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center">
                        <HiOutlineSparkles className="w-12 h-12 text-blue-500 mx-auto mb-6" />

                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Stay Updated with <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Exclusive Offers</span>
                        </h2>

                        <p className="text-gray-600 mb-8">
                            Subscribe to our newsletter and be the first to know about new arrivals, special promotions, and VIP events.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />

                            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                                Subscribe
                            </button>
                        </div>

                        <p className="text-sm text-gray-500 mt-4">
                            By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}