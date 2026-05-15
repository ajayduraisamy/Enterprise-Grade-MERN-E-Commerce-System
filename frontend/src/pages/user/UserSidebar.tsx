import { useAuth } from "../../hooks/useAuth";
import { useLocation, Link } from "react-router-dom";
import { FiGrid, FiShoppingBag, FiHeart, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";

const navItems = [
  { icon: FiGrid, label: "Dashboard", path: "/dashboard" },
  { icon: FiShoppingBag, label: "My Orders", path: "/dashboard/orders" },
  { icon: FiHeart, label: "Wishlist", path: "/dashboard/wishlist" },
  { icon: FiMapPin, label: "My Addresses", path: "/dashboard/addresses" },
  { icon: FiUser, label: "Profile Settings", path: "/dashboard/profile" },
];

export default function UserSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </Link>
      </div>
      <div className="flex-1 py-4 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-all w-full"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
