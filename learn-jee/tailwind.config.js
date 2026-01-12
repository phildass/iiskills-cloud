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
        primary: "#0056D2",
        secondary: "#10B981",
        accent: "#7B2CBF",
        charcoal: "#2E2E2E",
        neutral: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
