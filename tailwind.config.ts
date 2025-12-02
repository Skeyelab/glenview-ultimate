import type { Config } from "tailwindcss";

// Tailwind CSS v4 - Most configuration is now in CSS via @theme
// This file is kept minimal for content paths
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};
export default config;
