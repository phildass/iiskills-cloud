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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: '#0056D2',
        accent: '#7B2CBF',
        charcoal: '#2E2E2E',
        neutral: '#F5F5F5',
        learnapt: {
          blue: '#3b82f6',
          indigo: '#6366f1',
          purple: '#8b5cf6',
        },
      },
    },
  },
  plugins: [],
};
export default config;
