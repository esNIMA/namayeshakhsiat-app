import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: './public',
  server: {
    proxy: {
      '/checkmembership': {
        target: 'https://127.0.0.1:8000',
        secure: false,
        changeOrigin: true,
      },
    },
    // HTTPS config برای dev - در build نیاز نیست
    // https: {
    //   key: fs.readFileSync('./certs/localhost-key.pem'),
    //   cert: fs.readFileSync('./certs/localhost.pem'),
    // },
    host: true,
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), './src'),
    }
  },
});

