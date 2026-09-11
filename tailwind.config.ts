import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDF8",
          100: "#FFF8EC",
          200: "#FDEFD8",
        },
        peach: {
          100: "#FFEDE1",
          200: "#FFDCC4",
          300: "#FFC7A0",
          400: "#FFAB77",
          500: "#FF9257",
        },
        coral: {
          100: "#FFE4E0",
          200: "#FFC9C2",
          300: "#FFA79C",
          400: "#FF8577",
          500: "#FA6B5C",
        },
        mint: {
          100: "#E6F7F0",
          200: "#C9EDDD",
        },
      },
      fontFamily: {
        soft: ["'Gowun Dodum'", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 8px 24px -8px rgba(255, 146, 87, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
