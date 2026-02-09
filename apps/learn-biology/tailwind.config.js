/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx,mdx}',
    './components/**/*.{js,jsx,ts,tsx,mdx}',
    '../../components/**/*.{js,jsx,ts,tsx,mdx}',
    '../../packages/**/*.{js,jsx,ts,tsx,mdx}',
  ],
  safelist: [
    {
      pattern: /^(bg|text|border)-(primary|accent|neutral|charcoal)/,
    },
    {
      pattern: /^(bg|text|border)-(blue|purple|green|red|yellow|orange|gray)-(50|100|200|300|400|500|600|700|800|900)/,
    },
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2E7D32', // Moss Green
        accent: '#66BB6A', // Lighter green accent
        oxygen: '#FFFFFF', // Oxygen White
      },
    },
  },
  plugins: [],
}
