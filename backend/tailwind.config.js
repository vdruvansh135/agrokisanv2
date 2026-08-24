/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          green: '#2E7D32',      // Primary: Deep crop green
          leaf: '#4CAF50',       // Secondary: Fresh leaf green
          soil: '#5D4037',       // Accent: Rich soil brown
          wheat: '#FBC02D',      // Warning/Highlight: Harvest yellow
          sky: '#E1F5FE',        // Background light mode
          dark: '#121212',       // Background dark mode
          surface: '#1E1E1E'     // Card background dark mode
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}