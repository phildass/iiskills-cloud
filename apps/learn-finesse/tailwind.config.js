module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "../../components/shared/**/*.{js,jsx}",
    "../../packages/ui/src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1", // Indigo - sophisticated
        accent: "#ec4899", // Pink - elegant
        charcoal: "#1a1a1a", // Charcoal - dark premium
        champagne: "#f5e6d3", // Champagne Gold
        navy: "#1e3a5f", // Deep Navy
        gold: "#fbbf24",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"], // Sophisticated Serif for headings
        sans: ["Inter", "system-ui", "sans-serif"], // Clean Sans-Serif for body
      },
    },
  },
  plugins: [],
};
