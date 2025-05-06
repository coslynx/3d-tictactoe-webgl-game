import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  try {
    console.log('Vite configuration loading...');

    const env = process.env;

    const define = {
      'process.env.REACT_APP_API_URL': JSON.stringify(env.REACT_APP_API_URL || ''),
      'process.env.REACT_APP_WEBSOCKET_URL': JSON.stringify(env.REACT_APP_WEBSOCKET_URL || ''),
    };

    console.log('Environment variables:', define);

    const config = {
      plugins: [react()],
      resolve: {
        alias: {
          '@/src': path.resolve(__dirname, 'src'),
        },
      },
      optimizeDeps: {
        include: [
          'three',
          '@react-three/fiber',
          '@react-three/drei',
          'framer-motion',
        ],
      },
      build: {
        minify: 'terser',
        sourcemap: true,
        terserOptions: {
          compress: {
            drop_console: true,
            passes: 2,
          },
          format: {
            comments: false,
          },
        },
      },
      define,
    };

    if (!config.build?.minify) {
      console.warn('Warning: Minification is disabled. This can impact production performance.');
    }

    if (!config.build?.sourcemap) {
      console.warn('Warning: Source maps are disabled. This will make debugging production issues more difficult.');
    }

    console.log('Vite configuration loaded successfully.');
    return config;

  } catch (error) {
    console.error('Error loading Vite configuration:', error);
    throw error;
  }
})