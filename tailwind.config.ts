import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/components/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand = green (emerald). brand-600 = #059669 (verde-esmeralda),
        // brand-900 = #064e3b (verde-floresta), brand-950 ≈ verde-escuro.
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
          950: "#022c22",
        },
        // Gold = achievements, XP, medals, highlight CTAs.
        gold: {
          100: "#fef9c3",
          200: "#fef08a",
          300: "#fde047",
          400: "#facc15", // amarelo-dourado
          500: "#eab308", // dourado (shadows/details)
          600: "#ca8a04",
          DEFAULT: "#facc15",
        },
        ink: "#052e20", // verde-escuro — dark bg / dark text
        forest: "#064e3b", // verde-floresta — secondary surfaces / gradient end
        mint: "#dcfce7", // verde-claro — soft highlights / icon bg
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
