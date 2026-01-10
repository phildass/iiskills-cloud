/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0052CC",      // Logo blue
        accent: "#C77DDB",       // Logo purple
        neutral: "#F8F9FA",
        charcoal: "#24272a",
        // Pastel color palette for courses page
        'pastel-blue-light': '#B8D4F1',
        'pastel-blue': '#9BC4E9',
        'pastel-lavender-light': '#D5C6E8',
        'pastel-lavender': '#C2A9D9',
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
