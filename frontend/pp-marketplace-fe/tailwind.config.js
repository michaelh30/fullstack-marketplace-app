/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'gaming-purple': '#aa3bff',
        'gaming-cyan': '#00d4ff',
        'gaming-pink': '#ff006e',
        'gaming-orange': '#ff9500',
        'dark-950': '#0a0e27',
        'dark-900': '#1a1f3a',
        'dark-800': '#252d42',
        'dark-700': '#3a4558',
        'dark-600': '#4a5568',
        dark: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
        gaming: {
          purple: "#7c3aed",
          pink: "#ec4899",
          cyan: "#06b6d4",
          orange: "#f97316",
        }
      }
    },
  },
  plugins: [],
}
