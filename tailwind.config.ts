import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        night: {
          950: "#000521", // Near-Black Navy
          900: "#020C47", // Midnight Blue
          800: "#011F65", // Deep Blue
          700: "#0E4EB2", // Royal Blue
          600: "#2078CF", // Sky Blue Accent
          500: "#3894E8",
          400: "#60A9F6",
          300: "#93C5FD",
          200: "#BFDBFE",
          100: "#DBEAFE",
          50: "#EFF6FF",
        },
        glass: {
          surface: "rgba(2, 12, 71, 0.55)",
          surfaceHover: "rgba(14, 78, 178, 0.4)",
          border: "rgba(96, 169, 246, 0.25)",
          borderHover: "rgba(96, 169, 246, 0.6)",
          highlight: "rgba(255, 255, 255, 0.25)",
          glow: "rgba(32, 120, 207, 0.4)",
        },
        accent: {
          sky: "#2078CF",
          royal: "#0E4EB2",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#E11D48",
          purple: "#8B5CF6",
          cyan: "#06B6D4",
        }
      },
      fontFamily: {
        tajawal: ["Tajawal", "sans-serif"],
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-night": "linear-gradient(180deg, #020C47 0%, #011F65 50%, #000521 100%)",
        "gradient-glass": "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)",
        "gradient-liquid": "linear-gradient(135deg, rgba(32, 120, 207, 0.25) 0%, rgba(14, 78, 178, 0.1) 100%)",
      },
      boxShadow: {
        "liquid": "0 8px 32px 0 rgba(0, 5, 33, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.4)",
        "liquid-glow": "0 0 25px -5px rgba(32, 120, 207, 0.5), inset 0 1px 2px 0 rgba(255, 255, 255, 0.3)",
        "liquid-card": "0 12px 40px -10px rgba(0, 5, 33, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.18)",
        "liquid-button": "0 4px 20px 0 rgba(32, 120, 207, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.4), inset 0 -2px 4px 0 rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        }
      },
      animation: {
        "pulse-slow": "pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite",
      }
    },
  },
  plugins: [],
};
export default config;
