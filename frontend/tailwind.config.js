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
        background: 'var(--background)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        primary: {
          DEFAULT: '#5E6AD2', // A beautiful, slightly muted indigo
          50: '#F0F2FF',
          100: '#E1E5FE',
          200: '#C3CBFD',
          300: '#A4AFFC',
          400: '#8694F9',
          500: '#5E6AD2',
          600: '#4D58B5',
          700: '#3D4696',
          800: '#2D3478',
          900: '#1D2256',
        },
        secondary: {
          DEFAULT: '#141414',
          50: '#F4F4F5',
          100: '#E4E4E7',
          200: '#D4D4D8',
          300: '#A1A1AA',
          400: '#71717A',
          500: '#52525B',
          600: '#3F3F46',
          700: '#27272A',
          800: '#18181B',
          900: '#141414',
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        dark: {
          bg: '#09090B',       // Very dark gray/off-black (Zinc 950)
          card: '#121214',     // Slightly lighter for cards
          border: '#27272A',   // Zinc 800
          hover: '#18181B',    // Zinc 900
          muted: '#A1A1AA',    // Zinc 400
        },
        light: {
          bg: '#FFFFFF',
          card: '#FBFBFB',     // Extremely light gray
          border: '#E5E7EB',   // Gray 200
          hover: '#F3F4F6',    // Gray 100
          muted: '#6B7280',    // Gray 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        'glow': '0 0 20px rgba(94, 106, 210, 0.4)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0,0,0,0.02)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        lg: '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
