/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        primary: '#ECCEAE',
        default: '#E68369',
        secondary:'#131842'
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight:false,
  }
}

/* core plugins prefligt to false in order to not disturbt the other css */
