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
        charcoal: "#1f2937",
        gold: "#fbbf24",
      },
      fontFamily: {
        serif: ["Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
