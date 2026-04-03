/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ethereal Clarity — Stitch Design System
        primary: {
          50:  '#f3f0fb',
          100: '#e3dcf7',
          200: '#c9bef2',
          300: '#b29af7', // primary-container / primary-fixed
          400: '#a48de9', // primary-fixed-dim
          500: '#9D86E1', // brand lavender
          600: '#6750a7', // primary
          700: '#5a449a', // primary-dim
          800: '#392177',
          900: '#30156e',
          950: '#0f0035',
        },
        secondary: {
          50:  '#eef0fb',
          100: '#dce1ff', // secondary-container / secondary-fixed
          200: '#c8d3ff', // secondary-fixed-dim
          300: '#7e91d4',
          400: '#5f72b0',
          500: '#495c9b', // secondary
          600: '#3c508e', // secondary-dim
          700: '#455897',
          800: '#3b4e8d',
          900: '#273c79',
        },
        tertiary: {
          50:  '#f5f0fc',
          100: '#e8def8', // tertiary-container / tertiary-fixed
          200: '#dad0ea', // tertiary-fixed-dim
          500: '#635c71', // tertiary
          600: '#565065', // tertiary-dim
          700: '#554e64',
          800: '#5f586e',
          900: '#423c50',
        },
        surface: {
          DEFAULT:   '#faf9fc',
          bright:    '#faf9fc',
          dim:       '#d9d9e1',
          low:       '#f4f3f8', // surface-container-low
          base:      '#eeedf3', // surface-container
          high:      '#e8e7ee', // surface-container-high
          highest:   '#e2e2ea', // surface-container-highest
          lowest:    '#ffffff', // surface-container-lowest
        },
        on: {
          surface:   '#303238',
          'surface-variant': '#5d5f65',
          primary:   '#fdf7ff',
          secondary: '#faf8ff',
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
