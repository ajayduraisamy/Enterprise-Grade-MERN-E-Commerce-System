import { FiStar } from "react-icons/fi";

interface StarRatingProps {
    rating: number;
    onRate?: (rating: number) => void;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
}

const sizeClasses = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

export default function StarRating({ rating, onRate, size = "md", interactive = false }: StarRatingProps) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" disabled={!interactive} onClick={() => interactive && onRate?.(star)} className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}>
                    <FiStar className={`${sizeClasses[size]} ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}`} />
                </button>
            ))}
        </div>
    );
}
