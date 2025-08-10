import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
  '/api': process.env.VITE_API_TARGET || 'http://localhost:3001',
    },
  },
  resolve: {
    alias: {
  '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
});
