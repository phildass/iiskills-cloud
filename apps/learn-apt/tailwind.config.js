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
        // Original colors
        primary: '#1E40AF',
        accent: '#0EA5E9',
        // Learn Apt Diagnostic Engine Theme - Midnight Blue & Electric Violet
        'midnight': {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8793f8',
          500: '#6d6ef0',
          600: '#5a4de4',
          700: '#4c3bc9',
          800: '#3f32a3',
          900: '#1a1a3e', // Midnight Blue base
          950: '#0d0d1f', // Deeper midnight
        },
        'electric-violet': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7', // Electric Violet base
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        'emerald-glow': '#10b981', // For correct answers
        'ruby-fade': '#ef4444', // For incorrect answers
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orbit': 'orbit 20s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)',
          },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
