/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7C3AED", // Violeta Eléctrico
        secondary: "#06B6D4", // Cian Neón
        dark: "#0f172a", // Fondo base
        darker: "#020617", // Fondo profundo
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [],
};
