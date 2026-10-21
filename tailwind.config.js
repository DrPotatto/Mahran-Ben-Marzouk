/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './data/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#090B0E',
        graphite: '#14181D',
        'graphite-2': '#1B2027',
        steel: '#A8B0BA',
        gold: '#D7AE68',
        ivory: '#F3F0E9',
        amber: '#E8A33D',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
      },
      letterSpacing: {
        technical: '0.22em',
      },
      maxWidth: {
        content: '1280px',
      },
      transitionTimingFunction: {
        cinematic: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
