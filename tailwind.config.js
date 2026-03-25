/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'Nunito'", "sans-serif"],
        body: ["'Nunito'", "sans-serif"],
        pixel: ["'Press Start 2P'", "monospace"],
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
          card: 'var(--background-card)',
          secondary: 'var(--background-secondary)',
          tertiary: 'var(--background-tertiary)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          muted: 'var(--foreground-muted)',
          hint: 'var(--foreground-hint)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          bg: 'var(--accent-bg)',
        },
        success: {
          DEFAULT: 'var(--success)',
          bg: 'var(--success-bg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          bg: 'var(--warning-bg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          bg: 'var(--danger-bg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          bg: 'var(--info-bg)',
        },
        purple: {
          DEFAULT: 'var(--purple)',
          bg: 'var(--purple-bg)',
        },
        border: 'var(--border)',
        shadow: 'var(--shadow)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
}
