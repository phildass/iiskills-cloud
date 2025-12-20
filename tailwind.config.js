module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0052CC",      // Logo blue
        accent: "#C77DDB",       // Logo purple
        neutral: "#F8F9FA",
        charcoal: "#24272a"
      }
    },
    fontFamily: {
      sans: ['Inter', 'Arial', 'sans-serif'],
    },
  },
  plugins: [],
}