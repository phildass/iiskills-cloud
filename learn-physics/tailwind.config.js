/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        accent: '#9333ea',
        charcoal: '#333333',
        neutral: '#f5f5f5',
      },
    },
  },
  plugins: [],
}
