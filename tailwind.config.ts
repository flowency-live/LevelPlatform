import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        level: {
          primary: 'hsl(172, 55%, 35%)',
          'primary-dark': 'hsl(172, 55%, 25%)',
          'primary-light': 'hsl(172, 55%, 45%)',
          accent: 'hsl(175, 70%, 50%)',
          'accent-light': 'hsl(175, 70%, 65%)',
          background: 'hsl(180, 25%, 10%)',
          'background-light': 'hsl(180, 20%, 15%)',
          card: 'hsl(180, 20%, 15%)',
          foreground: 'hsl(0, 0%, 98%)',
          'muted-foreground': 'hsl(180, 10%, 60%)',
          muted: 'hsl(180, 15%, 20%)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
