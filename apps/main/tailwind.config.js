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
        primary: "#0052CC", // Logo blue
        accent: "#C77DDB", // Logo purple
        neutral: "#F8F9FA",
        charcoal: "#24272a",
        // Pastel color palette for courses page
        "pastel-blue-light": "#B8D4F1", // Soft light blue for available courses
        "pastel-blue": "#9BC4E9", // Medium blue for available courses
        "pastel-lavender-light": "#D5C6E8", // Soft lavender for coming soon
        "pastel-lavender": "#C2A9D9", // Medium lavender for coming soon
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
