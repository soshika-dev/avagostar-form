import daisyui from 'daisyui';

export default {
  content: ['./index.html', './src/**/*.{js,vue}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['light'],
  },
};
