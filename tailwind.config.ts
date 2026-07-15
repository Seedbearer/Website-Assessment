import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        soil: "#5C3D1E", // Primary — headings, dark bg, logo
        bark: "#8B6E4E", // Secondary — body text accents, borders
        straw: "#C4A882", // Accent — dividers, highlights
        linen: "#F5F0E8", // Background — all page backgrounds
        "off-white": "#FAF8F4", // Alternate section backgrounds
        "mid-gray": "#D3CFC9", // Borders, subtle dividers
        "dark-gray": "#4A4540", // Body text
        "deep-green": "#3D5A3E", // Growth — buttons, CTAs, sprout
        "new-growth": "#D4E8C2", // Light green — success states
        amber: "#C4924A", // Seed heart — breakthrough moments
      },
      fontFamily: {
        lora: ["var(--font-lora)"],
      },
    },
  },
  plugins: [],
};
export default config;
