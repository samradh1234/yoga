/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ringColor: {
        DEFAULT: '#ffffff',
      },
      colors: {
        accent: '#ffffff',
        // you can also add your yoga theme colors here
        lightBg: '#ffffff',
        darkBg: '#1a1209',
        primary: '#b8860b',   // golden
        secondary: '#5c4033', // earthy brown
      },
    },
  },
  plugins: [],
}
