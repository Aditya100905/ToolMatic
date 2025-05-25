import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Allows import from '@/components/...'
    },
  },
  server: {
    historyApiFallback: true, // Enables client-side routing fallback during dev
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'framer-motion';
            if (id.includes('react-toastify')) return 'react-toastify';
            if (id.includes('pdfjs-dist')) return 'pdfjs';
            return 'vendor';
          }
        }
      }
    }
  }
});
