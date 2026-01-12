/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B5394',    // Deep Blue
        secondary: '#1E88E5',  // Bright Blue
        accent: '#FF6B35',     // Vibrant Orange
        neutral: '#F5F5F5',    // Light Gray
        charcoal: '#2C3E50',   // Dark Gray
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
