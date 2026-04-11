import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ============================================
           SHADCN/UI SEMANTIC COLORS
           ============================================ */
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          border: 'hsl(var(--card-border))',
        },

        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
          border: 'hsl(var(--popover-border))',
        },

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          border: 'hsl(var(--primary-border))',
        },

        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          border: 'hsl(var(--secondary-border))',
        },

        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          border: 'hsl(var(--muted-border))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          border: 'hsl(var(--accent-border))',
        },

        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
          border: 'hsl(var(--destructive-border))',
        },

        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',

        /* ============================================
           LAYER 1: TENANT (runtime customizable)
           ============================================ */
        tenant: {
          primary: 'hsl(var(--tenant-primary))',
          'primary-foreground': 'hsl(var(--tenant-primary-foreground))',
          'primary-dark': 'hsl(var(--tenant-primary-dark))',
          secondary: 'hsl(var(--tenant-secondary))',
          accent: 'hsl(var(--tenant-accent))',
        },

        /* ============================================
           LAYER 2: FRAMEWORK (fixed)
           ============================================ */
        gatsby: {
          DEFAULT: 'hsl(var(--gatsby))',
          foreground: 'hsl(var(--gatsby-foreground))',
          dark: 'hsl(var(--gatsby-dark))',
          light: 'hsl(var(--gatsby-light))',
          bg: 'hsl(var(--gatsby-bg))',
          border: 'hsl(var(--gatsby-border))',
        },
        asdan: {
          DEFAULT: 'hsl(var(--asdan))',
          foreground: 'hsl(var(--asdan-foreground))',
          dark: 'hsl(var(--asdan-dark))',
          light: 'hsl(var(--asdan-light))',
          bg: 'hsl(var(--asdan-bg))',
          border: 'hsl(var(--asdan-border))',
        },
        individual: {
          DEFAULT: 'hsl(var(--individual))',
          foreground: 'hsl(var(--individual-foreground))',
          dark: 'hsl(var(--individual-dark))',
          light: 'hsl(var(--individual-light))',
          bg: 'hsl(var(--individual-bg))',
          border: 'hsl(var(--individual-border))',
        },

        /* ============================================
           LAYER 3: PERSONA
           ============================================ */
        persona: {
          student: 'hsl(var(--persona-student))',
          'student-bg': 'hsl(var(--persona-student-bg))',
          teacher: 'hsl(var(--persona-teacher))',
          'teacher-bg': 'hsl(var(--persona-teacher-bg))',
          management: 'hsl(var(--persona-management))',
          'management-bg': 'hsl(var(--persona-management-bg))',
        },

        /* ============================================
           LAYER 4: SYSTEM
           ============================================ */
        surface: {
          page: 'hsl(var(--surface-page))',
          card: 'hsl(var(--surface-card))',
          elevated: 'hsl(var(--surface-elevated))',
        },

        status: {
          success: 'hsl(var(--status-success))',
          'success-bg': 'hsl(var(--status-success-bg))',
          warning: 'hsl(var(--status-warning))',
          'warning-bg': 'hsl(var(--status-warning-bg))',
          error: 'hsl(var(--status-error))',
          'error-bg': 'hsl(var(--status-error-bg))',
          info: 'hsl(var(--status-info))',
          'info-bg': 'hsl(var(--status-info-bg))',
        },

        /* ============================================
           LEVEL LANDING PAGE NAMESPACE
           ============================================ */
        level: {
          primary: 'hsl(var(--level-primary))',
          'primary-foreground': 'hsl(var(--level-primary-foreground))',
          accent: 'hsl(var(--level-accent))',
          'accent-foreground': 'hsl(var(--level-accent-foreground))',
          muted: 'hsl(var(--level-muted))',
          'muted-foreground': 'hsl(var(--level-muted-foreground))',
        },

        /* ============================================
           SIDEBAR (for shadcn sidebar component)
           ============================================ */
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          border: 'hsl(var(--sidebar-border))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },

      fontFamily: {
        sans: ['var(--font-sans)', 'Source Sans 3', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
      },

      borderRadius: {
        sm: 'calc(var(--radius) - 4px)',
        DEFAULT: 'calc(var(--radius) - 2px)',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
      },

      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        focus: 'var(--shadow-focus)',
      },

      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },

      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-from-bottom': {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        'slide-in-from-top': {
          from: { transform: 'translateY(-100%)' },
          to: { transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },

      animation: {
        'fade-in': 'fade-in var(--duration-normal) ease-out',
        'fade-in-up': 'fade-in-up var(--duration-normal) ease-out',
        'slide-in-from-bottom': 'slide-in-from-bottom var(--duration-normal) ease-out',
        'slide-in-from-top': 'slide-in-from-top var(--duration-normal) ease-out',
        'scale-in': 'scale-in var(--duration-normal) ease-out',
      },
    },
  },
  plugins: [],
}
export default config
