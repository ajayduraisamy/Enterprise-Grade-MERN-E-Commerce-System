import { FiDollarSign, FiShoppingBag, FiUsers, FiBox } from "react-icons/fi";

const cards = [
    { label: "Total Revenue", value: "$24,500", icon: <FiDollarSign className="w-6 h-6" />, gradient: "from-blue-500 to-purple-500" },
    { label: "Total Orders", value: "156", icon: <FiShoppingBag className="w-6 h-6" />, gradient: "from-purple-500 to-pink-500" },
    { label: "Total Users", value: "1,234", icon: <FiUsers className="w-6 h-6" />, gradient: "from-emerald-500 to-teal-500" },
    { label: "Total Products", value: "89", icon: <FiBox className="w-6 h-6" />, gradient: "from-amber-500 to-orange-500" },
];

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Admin Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white`}>
                                {card.icon}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
