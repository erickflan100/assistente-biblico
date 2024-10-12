import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: "#F5F5F5",
        white_theme: "#F5F5F5",
        black: "#2E2E2E",
        black_theme: "#2E2E2E80",
        black_hover: "#2E2E2E20",
        white_hover: "#F1F1F150",
      },
    },
  },
  plugins: [],
};
export default config;
