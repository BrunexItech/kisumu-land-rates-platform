/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2A3D',
          deep: '#071D2B',
        },
        teal: {
          DEFAULT: '#0E6B6B',
          soft: '#E2F0EE',
        },
        green: {
          DEFAULT: '#1B7A4D',
          soft: '#E3F1E8',
        },
        gold: {
          DEFAULT: '#C8932B',
          soft: '#F8EFDC',
        },
        paper: {
          DEFAULT: '#F3F1EC',
          raised: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#152B36',
          faint: '#5E7480',
        },
        line: {
          DEFAULT: '#D8D2C4',
          soft: '#E8E4DA',
        },
        danger: {
          DEFAULT: '#9A3324',
          soft: '#F5DCD6',
        },
        amber: {
          DEFAULT: '#B4791F',
          soft: '#F6E7CF',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}