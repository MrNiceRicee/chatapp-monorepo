import { type Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      boxShadow: {
        'inner-shade-sm': `
          inset 1px 1px 3px -2px hsla(0, 0%, 100%, 1),
          inset -1px -1px 3px -2px hsla(0, 0%, 100%, 1)
        `,
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
        '4000': '4000ms',
        '5000': '5000ms',
        '6000': '6000ms',
        '7000': '7000ms',
      },
    },
  },
  plugins: [
    require('tailwindcss-safe-area'),
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
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
