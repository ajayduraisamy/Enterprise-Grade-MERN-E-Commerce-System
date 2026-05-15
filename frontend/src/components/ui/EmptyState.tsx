import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
    icon: ReactNode;
    title: string;
    description: string;
    actionText?: string;
    actionLink?: string;
    onAction?: () => void;
}

export default function EmptyState({ icon, title, description, actionText, actionLink, onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-6 text-gray-400">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{description}</p>
            {actionText && actionLink && (
                <Link to={actionLink} className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg">
                    {actionText}
                </Link>
            )}
            {actionText && onAction && (
                <button onClick={onAction} className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg">
                    {actionText}
                </button>
            )}
        </div>
    );
}
