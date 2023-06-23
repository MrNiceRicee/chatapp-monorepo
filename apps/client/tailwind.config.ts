// /** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {},
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
