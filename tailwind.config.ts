import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        glass: '0 8px 28px rgba(15, 42, 88, 0.26), inset 0 1px 0 rgba(255,255,255,0.45)',
      },
    },
  },
  plugins: [],
} satisfies Config;
