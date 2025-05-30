import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    tailwindcss()
  ],
  base: '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      external: ['@emotion/react', '@emotion/styled'],
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          ethers: ['ethers'],
          lighthouse: ['@lighthouse-web3/sdk'],
          mui: ['@mui/material', '@mui/icons-material']
        }
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  preview: {
    port: 3000,
    strictPort: true
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/icons-material'
    ]
  }
});