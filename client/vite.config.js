import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  // Check for VERCEL environment variable which is set in Vercel deployments
  const isVercel = process.env.VERCEL === '1';
  
  // Log environment variables to help debug
  console.log('Building with settings:', {
    isProduction,
    isVercel,
    base: isProduction && !isVercel ? './' : '/'
  });
  
  return {
    // Base URL for deployment
    // - For GitHub Pages: use './' (relative paths)
    // - For Vercel: use '/' (root paths)
    // - For development: use '/' (root paths)
    base: isProduction && !isVercel ? './' : '/',
    
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      // Use relative paths for assets
      assetsDir: 'assets',
      // Ensure assets use relative paths
      assetsInlineLimit: 0,
    },
    server: {
      port: 5173,
      open: true,
    },
  };
}); 