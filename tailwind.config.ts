import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Couleurs personnalisées pour les niveaux de vigilance
        vigilance: {
          1: '#22C55E', // Vert - Faible
          2: '#84CC16', // Lime - Modérée
          3: '#EAB308', // Jaune - Significative
          4: '#F97316', // Orange - Élevée
          5: '#EF4444', // Rouge - Critique
        },
        // Couleurs des domaines éthiques
        domain: {
          privacy: '#8B5CF6',      // Violet
          equity: '#EC4899',       // Rose
          transparency: '#F59E0B', // Ambre
          autonomy: '#10B981',     // Émeraude
          security: '#3B82F6',     // Bleu
          recourse: '#EF4444',     // Rouge
          sustainability: '#22C55E', // Vert
          accountability: '#6366F1', // Indigo
        },
        // Couleurs des types de noeuds
        node: {
          human: '#3B82F6',   // Bleu
          ai: '#8B5CF6',      // Violet
          infra: '#6B7280',   // Gris
          org: '#10B981',     // Vert
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out-right': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '50%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(0.95)', opacity: '1' },
        },
        'count-up': {
          from: { '--num': '0' },
          to: { '--num': 'var(--target)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.15s ease-out',
        'slide-in-right': 'slide-in-right 0.2s ease-out',
        'slide-out-right': 'slide-out-right 0.15s ease-out',
        'pulse-ring': 'pulse-ring 2s ease-in-out infinite',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
