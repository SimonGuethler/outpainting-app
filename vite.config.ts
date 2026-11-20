import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    build: {
        // Keep the browser targets used before the Vite upgrade.
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    },
    server: {
        host: true,
        port: 8080,
    },
    preview: {
        host: true,
        port: 8080,
    },
})
