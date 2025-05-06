/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode based on class name

  purge: [
    './src/**/*.tsx', // Purge unused styles from all .tsx files in the src directory
  ],

  theme: {
    extend: {
      // Custom color palette
      colors: {
        primary: '#282c34',   // Dark background color
        secondary: '#61dafb', // Light blue - React color, for highlights and X piece
        accent: '#98c379',    // Lime green - for the O piece and success states
        board: '#abb2bf',      // Light gray - for the board (brushed metal texture)
        'piece-x': '#61dafb', // Light blue - Color for the X piece
        'piece-o': '#98c379',  // Lime green - Color for the O piece
      },

      // Custom font families
      fontFamily: {
        'heading': ['Roboto Condensed', 'sans-serif'], // Font for headings
        'body': ['Open Sans', 'sans-serif'],           // Font for body text
      },

      // Custom spacing scale
      spacing: {
        'xs': '0.25rem',  // Extra small spacing
        'sm': '0.5rem',   // Small spacing
        'md': '1rem',     // Medium spacing
        'lg': '1.5rem',   // Large spacing
        'xl': '2rem',     // Extra large spacing
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'), // Add the forms plugin for styling form elements
  ],
}