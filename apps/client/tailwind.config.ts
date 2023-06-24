// /** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    boxShadow: {
      'inner-shade-sm': `
        inset 1px 1px 3px -2px hsla(0, 0%, 100%, 1),
        inset -1px -1px 3px -2px hsla(0, 0%, 100%, 1)
      `
    },
    extend: {
    },
  },
  plugins: [require('tailwindcss-safe-area'),
    plugin(function ({ addComponents }) {
      addComponents({
        '.grain-overlay': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundImage: "url('/grain.png')",
            backgroundSize: '250px 250px',
            pointerEvents: 'none',
          },
        },
      });
    }),
],
} satisfies Config;

export default config;
