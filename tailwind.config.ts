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
        // Layer 1: Tenant (runtime customizable via CSS vars)
        tenant: {
          primary: 'var(--tenant-primary)',
          'primary-dark': 'var(--tenant-primary-dark)',
          secondary: 'var(--tenant-secondary)',
          accent: 'var(--tenant-accent)',
        },

        // Layer 2: Framework (fixed)
        gatsby: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#93C5FD',
          bg: '#EFF6FF',
          border: '#BFDBFE',
        },
        asdan: {
          DEFAULT: '#22C55E',
          dark: '#16A34A',
          light: '#86EFAC',
          bg: '#F0FDF4',
          border: '#BBF7D0',
        },
        individual: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FDBA74',
          bg: '#FFF7ED',
          border: '#FED7AA',
        },

        // Layer 3: Persona
        persona: {
          student: '#3B82F6',
          'student-bg': '#EFF6FF',
          teacher: '#14B8A6',
          'teacher-bg': '#F0FDFA',
          management: '#64748B',
          'management-bg': '#F8FAFC',
        },

        // Layer 4: System (using Tailwind grays + custom)
        surface: {
          page: '#F9FAFB',
          card: '#FFFFFF',
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          strong: '#D1D5DB',
        },
        status: {
          success: '#22C55E',
          'success-bg': '#F0FDF4',
          warning: '#F59E0B',
          'warning-bg': '#FFFBEB',
          error: '#EF4444',
          'error-bg': '#FEF2F2',
          info: '#3B82F6',
          'info-bg': '#EFF6FF',
        },
      },
      fontFamily: {
        sans: ['var(--font-source-sans)', 'Source Sans 3', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '0.375rem',
        DEFAULT: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        focus: '0 0 0 3px rgba(107, 155, 138, 0.4)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
export default config
