const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      primary: {
        // Orange
        light: '#ffdbcd',
        default: '#FF6300',
        dark: '#a43d00',
      },
      secondary: {
        // Brown
        light: '#e7beae',
        default: '#77574a',
        dark: '#5d4034',
      },
      neutral: {
        // Grey
        light: '#EDF2F7',
        default: '#85736d',
        dark: '#4A5568',
      },
      background: {
        // Grey
        light: '#444444',
        default: '#292929',
        dark: '#101010',
      },
      green: {
        light: '#C6F6D5' /* green.200 */,
        default: '#68D391' /* green.400 */,
        dark: '#2F855A' /* green.700 */,
      },
      red: {
        light: '#fecaca' /* red.200 */,
        default: '#f87171' /* red.400 */,
        dark: '#b91c1c' /* red.700 */,
      },
      pink: {
        light: '#FED7E2' /* pink.200 */,
        default: '#F687B3' /* pink.400 */,
        dark: '#B83280' /* pink.700 */,
      },
      blue: {
        light: '#BEE3F8' /* blue.200 */,
        default: '#63B3ED' /* blue.400 */,
        dark: '#2B6CB0' /* blue.700 */,
      },
      amber: {
        light: '#fde68a' /* amber.200 */,
        default: '#fbbf24' /* amber.400 */,
        dark: '#b45309' /* amber.700 */,
      },
      violet: {
        light: '#e9d5ff' /* violet.200 */,
        default: '#c084fc' /* violet.400 */,
        dark: '#7e22ce' /* violet.700 */,
      },
    },
  },
  plugins: [],
};
