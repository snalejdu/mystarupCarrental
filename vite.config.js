import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, 'resources/js'),
            '@modules': path.resolve(import.meta.dirname, 'Modules'),
        },
    },
    server: {
        origin: 'http://192.168.100.56:5173',
        cors: true,
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        target: 'es2020',
    },
});
