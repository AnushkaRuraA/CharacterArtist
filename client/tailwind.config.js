/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#0A0A0A',
        'off-white': '#F0EDE6',
        amber: '#FF6B1A',
        crimson: '#C1121F',
        gold: '#B89A5E',
        'dark-surface': '#111111',
        'dark-border': '#1E1E1E',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      fontSize: {
        'fluid-xl': 'clamp(3rem, 8vw, 8rem)',
        'fluid-lg': 'clamp(2rem, 5vw, 5rem)',
        'fluid-md': 'clamp(1.25rem, 3vw, 2.5rem)',
      },
    },
  },
  plugins: [],
};
