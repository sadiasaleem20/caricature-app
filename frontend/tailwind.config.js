/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        caric: {
          wood: "#4C2A21",
          willow: "#814875",
          mauve: "#C663A6",
          carnation: "#EC81A2",
          sango: "#FFC2B9",
          caramel: "#F5C9A6",
        },
      },
      fontFamily: {
        script: ["'Caveat'", "cursive"],
        fun: ["'Quicksand'", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pop: {
          "0%": { transform: "scale(0.8)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        pop: "pop 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
