/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yellow: {
          400: '#FFD700',
        },
        orange: {
          400: '#FF9500',
        },
        magenta: {
          500: '#C13584',
          600: '#A50069',
        },
        purple: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7519DB',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        blue: {
          600: '#1F51FF',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.purple.800'),
            h1: {
              color: theme('colors.purple.900'),
            },
            h2: {
              color: theme('colors.purple.900'),
            },
            h3: {
              color: theme('colors.purple.900'),
            },
            strong: {
              color: theme('colors.purple.900'),
            },
            a: {
              color: theme('colors.purple.700'),
              '&:hover': {
                color: theme('colors.purple.800'),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [],
};