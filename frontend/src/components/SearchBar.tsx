import { useState, useEffect } from "react";
import { FiSearch, FiX } from "react-icons/fi";

type Props = {
    value: string;                 // Controlled value
    onChange: (v: string) => void; // When user types
    placeholder?: string;
    className?: string;
    autoFocus?: boolean;
    debounce?: number;             // Delay in ms
};

export default function SearchBar({
    value,
    onChange,
    placeholder = "Search products...",
    className = "",
    autoFocus = false,
    debounce = 300
}: Props) {

    const [internalValue, setInternalValue] = useState(value);

    // Sync when value changes externally
    useEffect(() => {
        setInternalValue(value);
    }, [value]);

    // Debounce typing
    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(internalValue);
        }, debounce);

        return () => clearTimeout(timeout);
    }, [internalValue, debounce]);

    return (
        <div
            className={`
                relative
                flex items-center
                bg-orange-800
                border border-gray-700
                rounded-xl
                px-3 py-2
                focus-within:ring-2
                focus-within:ring-accent
                transition-all
                ${className}
            `}
        >
            {/* Left Search Icon */}
            <FiSearch className="text-gray-400 w-5 h-5 mr-2" />

            {/* Input */}
            <input
                value={internalValue}
                onChange={(e) => setInternalValue(e.target.value)}
                placeholder={placeholder}
                className="bg-transparent w-full outline-none text-white"
                autoFocus={autoFocus}
            />

            {/* Clear Button (X) */}
            {internalValue && (
                <button
                    onClick={() => {
                        setInternalValue("");
                        onChange("");
                    }}
                    className="text-gray-400 hover:text-accent transition"
                >
                    <FiX className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
