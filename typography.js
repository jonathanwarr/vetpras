/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
      extend: {
        typography: {
          DEFAULT: {
            css: {
              color: '#fff', // Example tweak
              a: { color: '#93c5fd' }, // Tailwind sky-300
            },
          },
        },
      },
    },
  }
  