/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        tomorrow: ['Tomorrow', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif']
      }
    }
  },
  plugins: [require('daisyui')]
}
