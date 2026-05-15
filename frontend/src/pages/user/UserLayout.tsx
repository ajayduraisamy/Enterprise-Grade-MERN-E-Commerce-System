import { Outlet, NavLink } from "react-router-dom";
import { FiGrid, FiPackage, FiHeart, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";

const navItems = [
    { to: "/dashboard", icon: <FiGrid className="w-5 h-5" />, label: "Dashboard", end: true },
    { to: "/dashboard/orders", icon: <FiPackage className="w-5 h-5" />, label: "Orders", end: false },
    { to: "/dashboard/wishlist", icon: <FiHeart className="w-5 h-5" />, label: "Wishlist", end: false },
    { to: "/dashboard/addresses", icon: <FiMapPin className="w-5 h-5" />, label: "Addresses", end: false },
    { to: "/dashboard/profile", icon: <FiUser className="w-5 h-5" />, label: "Profile", end: false },
];

export default function UserLayout() {
    const { user, logout } = useAuth();
    return (
        <div className="min-h-[80vh]">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                            <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                                <h2 className="font-bold text-gray-800 dark:text-white">{user?.name || "User"}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                            </div>
                            <nav className="space-y-1">
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.end}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`
                                        }
                                    >
                                        {item.icon}
                                        {item.label}
                                    </NavLink>
                                ))}
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all"
                                >
                                    <FiLogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </aside>
                    {/* Content */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
