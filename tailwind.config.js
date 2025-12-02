module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
<<<<<<< HEAD
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
=======
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
>>>>>>> be03ef6dd2fd53272582227afc86125b1216bfcb
  },
  plugins: [],
}