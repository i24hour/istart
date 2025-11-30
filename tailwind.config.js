/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'water-blue': '#4A90E2',
        'water-cyan': '#3B82F6',
        'sky-light': '#BAE6FD',
        'success-green': '#10B981',
        'warning-yellow': '#F59E0B',
        'danger-red': '#EF4444',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fill-water': 'fillWater 2s ease-out',
      },
      keyframes: {
        fillWater: {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
