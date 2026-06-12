import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        // Output goes to Spring Boot's static resources folder
        outDir: '../backend/src/main/resources/static',
        emptyOutDir: true,
    },
    server: {
        // Dev proxy: forwards /api calls to Spring Boot
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    }
});
