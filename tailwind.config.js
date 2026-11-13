/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          950: 'rgb(var(--brand-950) / <alpha-value>)'
        },
        navy: {
          50: '#f3f6fb',
          100: '#e6ecf5',
          200: '#c7d3e9',
          300: '#9db3d6',
          400: '#6d8cc0',
          500: '#486aa8',
          600: '#33528b',
          700: '#284271',
          800: '#1c2f52',
          900: '#0a1628',
          950: '#050d18'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(10, 22, 40, 0.12)',
        card: '0 2px 12px -2px rgba(10, 22, 40, 0.08)',
        lift: '0 20px 40px -12px rgba(10, 22, 40, 0.25)',
        glow: '0 0 40px -8px rgba(59, 130, 246, 0.5)'
      },
      backgroundImage: {
        'hero-grid': 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'brand-gradient': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #0f2a6e 100%)'
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-out both'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
