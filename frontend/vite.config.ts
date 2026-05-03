import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  server: {
    host: true,
    port: 5273,
    proxy: {
      '/api': {
        target: 'http://backend:8100',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['marked'],
  },
});
