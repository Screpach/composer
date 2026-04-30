import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        glass: '#eaf5ff'
      },
      boxShadow: {
        glow: '0 0 20px rgba(34,211,238,0.35)'
      }
    }
  },
  plugins: []
} satisfies Config;
