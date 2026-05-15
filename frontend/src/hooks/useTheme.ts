import { useUIStore } from "../store/uiStore";

export function useTheme() {
    const theme = useUIStore((s) => s.theme);
    const toggleTheme = useUIStore((s) => s.toggleTheme);
    return { theme, toggleTheme };
}
