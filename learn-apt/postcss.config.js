/**
 * PostCSS Configuration for Learn-Apt
 * 
 * Note: Autoprefixer is not needed as it's built into Tailwind CSS v4.
 * The @tailwindcss/postcss plugin handles all necessary vendor prefixes.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
