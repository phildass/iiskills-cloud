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
        primary: '#1E40AF',
        accent: '#0EA5E9',
      },
    },
  },
  plugins: [],
};
