/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d2d2d',
        secondary: '#c3c3c3e9',
        accent: '#e2e1dd',
      },
      fontFamily: {
        primary: ['Inter', 'sans-serif'],
        title: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
