import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Removed the 'base' option.  It's generally better to omit it unless you *know* you need it.
  // If you deploy to a subdirectory, you can add it back, but make sure it's correct.
});
