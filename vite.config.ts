import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // base: '/your-app/', // Use this if deploying to a subdirectory.  Change 'your-app' to your app's name.
  // OMIT the 'base' option if deploying to the root of a domain.
});
