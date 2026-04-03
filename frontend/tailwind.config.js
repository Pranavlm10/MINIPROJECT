/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ocean Deep Design System
        primary: {
          50:  '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8', // primary-container
          400: '#829ab1', 
          500: '#627d98', 
          600: '#2a5a8c', // Ocean Blue
          700: '#234a75', 
          800: '#1d3a5e',
          900: '#162b46',
          950: '#0b1624',
        },
        secondary: {
          50:  '#f0fcff',
          100: '#dbf6ff', // secondary-container
          200: '#adebff', 
          300: '#75ddff',
          400: '#33ccff',
          500: '#00b4d8', // Cyan
          600: '#008fb3', 
          700: '#00708f',
          800: '#005a75',
          900: '#00475c',
        },
        tertiary: {
          50:  '#f5f7fa',
          100: '#e4e7eb', // tertiary-container
          200: '#cbd2d9',
          500: '#7b8794', // tertiary
          600: '#616e7c',
          700: '#52606d',
          800: '#3e4c59',
          900: '#323f4b',
        },
        surface: {
          DEFAULT:   '#f4f6f9',
          bright:    '#f8f9fc',
          dim:       '#dce1e6',
          low:       '#f7f9fa',
          base:      '#f4f6f9',
          high:      '#eef1f5',
          highest:   '#e6eaef',
          lowest:    '#ffffff',
        },
        on: {
          surface:   '#18212b',
          'surface-variant': '#4a5b6d',
          primary:   '#ffffff',
          secondary: '#ffffff',
          tertiary:  '#fdf7ff',
          background:'#303238',
          error:     '#fff7f7',
        },
        outline: {
          DEFAULT: '#797a81',
          variant: '#b1b1b9',
        },
        error: {
          DEFAULT:   '#a8364b',
          container: '#f97386',
          dim:       '#6b0221',
        },
      },
      fontFamily: {
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl2': '1.5rem',
        'xl3': '2rem',
        'xl4': '2.5rem',
        'xl5': '3rem',
        'xl6': '3.5rem',
      },
      boxShadow: {
        'ambient': '0 0 40px 0 rgba(48,50,56,0.04)',
        'ambient-lg': '0 0 60px 0 rgba(48,50,56,0.06)',
        'primary-glow': '0 8px 30px rgba(103,80,167,0.15)',
        'primary-glow-lg': '0 20px 50px rgba(103,80,167,0.2)',
      },
      animation: {
        'slide-up':      'slideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':       'fadeIn 0.5s ease-out',
        'pulse-slow':    'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'float':         'float 6s ease-in-out infinite',
        'orb-pulse':     'orbPulse 3s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        orbPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%':      { transform: 'scale(1.08)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
