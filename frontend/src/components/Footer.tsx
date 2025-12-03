import { Link } from "react-router-dom";
import {
    FaShieldAlt,
    FaTruck,
    FaHeadset,
    FaLeaf
} from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">

            {/* TOP FEATURES */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Item */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition">
                            <div className="p-3 rounded-full bg-blue-100">
                                <FaTruck className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Free Shipping</h3>
                                <p className="text-sm text-gray-600">On orders over $50</p>
                            </div>
                        </div>

                        {/* Item */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-green-50 hover:bg-green-100 transition">
                            <div className="p-3 rounded-full bg-green-100">
                                <FaHeadset className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">24/7 Support</h3>
                                <p className="text-sm text-gray-600">Dedicated support team</p>
                            </div>
                        </div>

                        {/* Item */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition">
                            <div className="p-3 rounded-full bg-purple-100">
                                <FaShieldAlt className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                                <p className="text-sm text-gray-600">100% secure transactions</p>
                            </div>
                        </div>

                        {/* Item */}
                        <div className="flex items-center space-x-4 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition">
                            <div className="p-3 rounded-full bg-amber-100">
                                <FaLeaf className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Eco Friendly</h3>
                                <p className="text-sm text-gray-600">Sustainable packaging</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* BOTTOM BAR */}
            <div className="border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4
                        flex flex-col md:flex-row
                        justify-between items-center
                        gap-3">

                    <p className="text-gray-600 text-lg text-center">
                        © {currentYear}{" "}
                        <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            DRNEXGEN
                        </span>{" "}
                        — All rights reserved.
                    </p>

                    <div className="flex space-x-4 text-lg">
                        <Link to="/contact" className="text-gray-500 hover:text-gray-700">
                            Contact
                        </Link>
                        <Link to="/privacy" className="text-gray-500 hover:text-gray-700">
                            Privacy
                        </Link>
                        <Link to="/terms" className="text-gray-500 hover:text-gray-700">
                            Terms
                        </Link>
                        <Link to="/cookies" className="text-gray-500 hover:text-gray-700">
                            Cookies
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}
