const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE:
  // 1. Don't include CSS files here
  // 2. Don’t construct class names dynamically
  // See: https://tailwindcss.com/docs/content-configuration#configuring-source-paths
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography')
  ],
}
