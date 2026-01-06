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
        charcoal: "#24272a",
        // Pastel color palette for courses page
        'pastel-blue-light': '#B8D4F1',    // Soft light blue for available courses
        'pastel-blue': '#9BC4E9',          // Medium blue for available courses
        'pastel-lavender-light': '#D5C6E8', // Soft lavender for coming soon
        'pastel-lavender': '#C2A9D9',      // Medium lavender for coming soon
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}