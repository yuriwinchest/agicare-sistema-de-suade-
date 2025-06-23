import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./index.html",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#0B8A8F",
          light: "#14B8A6",
          dark: "#075E5F",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#0891B2",
          light: "#22D3EE",
          dark: "#0E7490",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#3B82F6",
          light: "#60A5FA",
          dark: "#2563EB",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "#DAD5DC",
          darker: "#B8B4BA",
          foreground: "hsl(var(--muted-foreground))",
        },
        // Sidebar colors
        sidebar: {
          DEFAULT: "#0B8A8F",
          foreground: "#FFFFFF",
          muted: "rgba(255, 255, 255, 0.7)",
          border: "rgba(255, 255, 255, 0.1)",
          ring: "rgba(255, 255, 255, 0.3)",
          item: {
            active: "#14B8A6",
            "active-foreground": "#FFFFFF",
            hover: "rgba(255, 255, 255, 0.1)",
            "hover-foreground": "#FFFFFF",
          }
        },
        // Theme colors for clinical systems
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        },
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        emerald: {
          600: '#059669',
          700: '#047857',
        },
        clinic: {
          DEFAULT: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0D9488',
        },
        // Keep these colors for backward compatibility
        indigo: {
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
        purple: {
          600: '#9333EA',
          700: '#7E22CE',
        },
        dental: {
          DEFAULT: 'hsl(230, 100%, 50%)',
          light: 'hsl(230, 100%, 60%)',
          dark: 'hsl(230, 100%, 40%)',
        },
        medgray: {
          50: 'hsl(210, 20%, 99%)',
          100: 'hsl(210, 20%, 98%)',
          200: 'hsl(210, 20%, 95%)',
          300: 'hsl(210, 20%, 90%)',
          400: 'hsl(210, 20%, 80%)',
          500: 'hsl(210, 20%, 70%)',
        },
        medblue: {
          DEFAULT: 'hsl(210, 100%, 50%)',
          light: 'hsl(210, 100%, 60%)',
          dark: 'hsl(210, 100%, 40%)',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' }
        },
        slideIn: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' }
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'logo-spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fadeIn: 'fadeIn 0.5s ease-out',
        slideIn: 'slideIn 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'logo-spin': 'logo-spin 4s linear infinite',
      },
      boxShadow: {
        'neomorphic': '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
        'neomorphic-sm': '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)'
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
