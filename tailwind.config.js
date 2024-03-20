/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false,
  },
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      xxl: '1536px',
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000',
      white: '#fff',
      primary: '#fc5000',
      secondary: '#696969',
      secondaryIcon1: '#fd7333',
      secondaryIcon2: '#ffd648',
      error: '#f00',
      secondary4: '#333',
      secondary5: '#a1a1a1',
      disabled: '#acadb0',
      secondaryLine: '#ccc',
      bg1: '#fff',
      bg2: '#f5f7fb',
      bgLine: '#d9d9d9',
      textSecondary1: '#666',
      textSecondary2: '#696969',
      textSecondary3: '#fff',
      textSecondary4: '#333',
      accentLeaf: '#27b9ba',
    },
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
