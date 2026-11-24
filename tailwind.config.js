/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B192C',
          midnight: '#1E3E62',
          deep: '#001E3D',
          royal: '#1D4ED8',
          accent: '#0284C7',
          sky: '#38BDF8',
          soft: '#E0F2FE',
          ice: '#F0F9FF',
          surface: '#F8FAFC'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(15, 23, 42, 0.05), 0 1px 4px -1px rgba(15, 23, 42, 0.03)',
        'soft-md': '0 8px 24px -4px rgba(11, 25, 44, 0.08), 0 4px 12px -2px rgba(11, 25, 44, 0.04)',
        'soft-lg': '0 20px 35px -8px rgba(11, 25, 44, 0.12), 0 10px 18px -4px rgba(11, 25, 44, 0.06)',
        'glow': '0 0 25px -5px rgba(2, 132, 199, 0.35)',
      }
    },
  },
  plugins: [],
}
