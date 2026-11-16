/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        concrete: '#edeeec',
        surface: '#fafaf8',
        ink: {
          DEFAULT: '#1e2528',
          muted: '#526065',
          light: '#78888e',
        },
        slate: {
          deep: '#243b42',
          hover: '#1b2d33',
          subtle: '#e4ebed',
        },
        brass: {
          DEFAULT: '#b08d57',
          hover: '#9c7b48',
          light: '#f5efe6',
          dark: '#c8a36d',
        },
        brick: {
          DEFAULT: '#8f3a2f',
          light: '#faeae8',
        },
        charcoal: {
          900: '#121618',
          800: '#1a2023',
          700: '#232b2f',
          600: '#2f3a3f',
          500: '#3f4e55',
        }
      },
      fontFamily: {
        heading: ['Jost', 'sans-serif'],
        body: ['Hind', 'Noto Sans Devanagari', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '4px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
        full: '9999px',
      },
      boxShadow: {
        none: 'none',
      }
    },
  },
  plugins: [],
}
