import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],//  Project root is current directory
    server: {
        port: 5000,
        strictPort: false,
        open: false,
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
    },
});