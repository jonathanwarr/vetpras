/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        keyframes: {
          slideIn: {
            '0%': { transform: 'translateX(100%)' },
            '100%': { transform: 'translateX(0)' },
          },
        },
        animation: {
          slideIn: 'slideIn 0.5s ease-in-out forwards',
        },        
      },
    },
    plugins: [require('@tailwindcss/typography'),
    ],
  }
  