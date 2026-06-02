/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts,tsx}', './src/popup/index.html'],
  theme: {
    extend: {
      colors: {
        nc: {
          green: {
            50: '#ECFDF5',
            500: '#2D9F6E',
            600: '#23865B',
            700: '#1A6D48',
          },
          rating: {
            excellent: '#2D9F6E',
            good: '#6ABF4B',
            average: '#F5A623',
            poor: '#E8863B',
            bad: '#E04848',
          },
          up: {
            bg: '#FFF3E0',
            border: '#FFB74D',
            text: '#E65100',
            icon: '#F57C00',
          },
          gray: {
            50: '#F9FAFB',
            100: '#F3F4F6',
            200: '#E5E7EB',
            300: '#D1D5DB',
            500: '#6B7280',
            700: '#374151',
            900: '#111827',
          },
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        inter: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'nc-xs': ['11px', '1.4'],
        'nc-sm': ['12px', '1.4'],
        'nc-base': ['13px', '1.5'],
        'nc-md': ['14px', '1.4'],
        'nc-lg': ['16px', '1.3'],
        'nc-xl': ['18px', '1.3'],
        'nc-2xl': ['22px', '1.2'],
      },
      spacing: {
        'nc-1': '4px',
        'nc-2': '8px',
        'nc-3': '12px',
        'nc-4': '16px',
        'nc-5': '20px',
        'nc-6': '24px',
        'nc-8': '32px',
      },
      borderRadius: {
        'nc-sm': '4px',
        'nc-md': '6px',
        'nc-lg': '8px',
        'nc-xl': '12px',
        'nc-full': '9999px',
      },
      boxShadow: {
        'nc-sm': '0 1px 2px rgba(0,0,0,0.06)',
        'nc-md': '0 2px 8px rgba(0,0,0,0.08)',
        'nc-lg': '0 4px 16px rgba(0,0,0,0.12)',
        'nc-overlay': '0 8px 32px rgba(0,0,0,0.16)',
      },
      letterSpacing: {
        'nc-heading': '-0.01em',
        'nc-label': '0.02em',
      },
    },
  },
  plugins: [],
};