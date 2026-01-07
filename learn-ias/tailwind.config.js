/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../components/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',    // Saffron for IAS/India theme
        secondary: '#138808',  // Green (India flag)
        accent: '#000080',     // Navy Blue (India flag)
        charcoal: '#2D3748',
        neutral: '#F7FAFC',
      },
    },
  },
  plugins: [],
}
