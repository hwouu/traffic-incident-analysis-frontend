import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // emerald-500
          light: '#34D399',   // emerald-400
          dark: '#059669',    // emerald-600
        },
        secondary: {
          DEFAULT: '#6B7280', // gray-500
          light: '#9CA3AF',   // gray-400
          dark: '#4B5563',    // gray-600
        },
        // 배경색 정의 수정
        white: '#FFFFFF',
        background: '#FFFFFF',
        'dark-background': '#111827', // gray-900
        'dark-surface': '#1F2937',    // gray-800
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        jamsil: ['The Jamsil', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.7s ease-out forwards',
      },
      
    },
  },
  plugins: [],
};

export default config;