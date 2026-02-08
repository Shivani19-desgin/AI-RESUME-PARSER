/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",   // 👈 THIS IS IMPORTANT
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
