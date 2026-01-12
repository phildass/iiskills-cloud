/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "../components/shared/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6", // Blue for JEE/education theme
        secondary: "#10B981", // Green
        accent: "#8B5CF6", // Purple
        charcoal: "#2D3748",
        neutral: "#F7FAFC",

        primary: "#0056D2",
        accent: "#7B2CBF",
        charcoal: "#2E2E2E",
        neutral: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
