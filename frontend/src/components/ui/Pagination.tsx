import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | string)[] = [];
        const delta = 2;
        const start = Math.max(1, page - delta);
        const end = Math.min(totalPages, page + delta);
        if (start > 1) pages.push(1);
        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");
        if (end < totalPages) pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                <FiChevronLeft className="w-5 h-5" />
            </button>
            {getPages().map((p, i) => (
                <button key={i} disabled={p === "..."} onClick={() => typeof p === "number" && onPageChange(p)} className={`w-10 h-10 rounded-lg font-medium text-sm transition ${p === page ? "bg-blue-600 text-white" : "border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"} ${p === "..." ? "cursor-default" : ""}`}>
                    {p}
                </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                <FiChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
