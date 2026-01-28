import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        card: '0 18px 40px -24px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        avagostarLight: {
          primary: '#005020',
          secondary: '#0E6A3B',
          accent: '#178A4A',
          neutral: '#0F172A',
          'base-100': '#F8FAFC',
          'base-200': '#EEF2F7',
          'base-300': '#E2E8F0',
          info: '#0284C7',
          success: '#15803D',
          warning: '#D97706',
          error: '#DC2626',
        },
      },
      {
        avagostarDark: {
          primary: '#178A4A',
          secondary: '#0E6A3B',
          accent: '#22C55E',
          neutral: '#E5E7EB',
          'base-100': '#07140E',
          'base-200': '#0B2016',
          'base-300': '#0F2A1D',
          info: '#38BDF8',
          success: '#22C55E',
          warning: '#FBBF24',
          error: '#F87171',
          'base-content': '#E5E7EB',
        },
      },
    ],
    darkTheme: 'avagostarDark',
  },
};
