export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: "#2563EB",
        secondary: "#6366F1",
        accent: "#0EA5E9",

        admin: "#7C3AED",
        user: "#059669",

        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
        info: "#0284C7",

        dark: "#0F172A",
        darker: "#020617",
        light: "#F8FAFC",
        muted: "#CBD5E1",

        pink: "#EC4899",
        orange: "#EA580C",
        teal: "#14B8A6",
        lime: "#84CC16",
        rose: "#F43F5E",
      }
    }
  },
  plugins: []
}
