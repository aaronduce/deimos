const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      boxShadow: {
        'left-marker': 'inset 7px 0px 0px 0px',
      },
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ],
  
};