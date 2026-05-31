import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In Docker Compose the API service hostname is "api".
const apiTarget = process.env.API_PROXY_TARGET ?? 'http://api:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});