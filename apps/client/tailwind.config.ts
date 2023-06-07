// /** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
