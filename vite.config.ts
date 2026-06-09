import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Biar alias '@' rapi mengarah ke folder src
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    build: {
      // Wajib dikunci ke folder 'dist' agar dibaca oleh vercel.json
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      // Tetap pertahankan logic bawaan AI Studio biar gak flickering
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});