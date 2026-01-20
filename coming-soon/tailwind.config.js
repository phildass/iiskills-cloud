/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af",
        accent: "#7c3aed",
        neutral: "#f3f4f6",
        charcoal: "#374151",
      },
    },
  },
  plugins: [],
};
