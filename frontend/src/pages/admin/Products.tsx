import { FiBox } from "react-icons/fi";

export default function AdminProducts() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Manage Products</h1>
            <div className="text-center py-12">
                <FiBox className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Product management coming soon</p>
            </div>
        </div>
    );
}
