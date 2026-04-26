import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#090b12",
        panel: "#111624",
        accent: "#6f84ff",
        muted: "#8b92ab"
      }
    }
  },
  plugins: []
};

export default config;
