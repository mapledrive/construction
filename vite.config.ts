import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/construction/',
  plugins: [react()],
  server: {
    open: true,
    port: 3000,
  },
});
