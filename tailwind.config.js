/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f97316',
          foreground: '#ffffff',
        },
        muted: '#f3f4f6',
        success: '#22c55e',
        danger: '#ef4444',
        theme: {
          bg: 'var(--theme-bg)',
          surface: 'var(--theme-surface)',
          text: 'var(--theme-text)',
        },
      },
      backgroundColor: {
        'theme-bg': 'var(--theme-bg)',
        'theme-surface': 'var(--theme-surface)',
      },
      textColor: {
        'theme-text': 'var(--theme-text)',
      },
      borderColor: {
        'theme-border': 'var(--theme-surface)',
      },
    },
  },
  plugins: [],
}
