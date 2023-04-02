import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    /* optimizeDeps: {
        include: ['/react-grid-layout-next/']
    },

    resolve: {
        alias: {
            'test-xyz': path.join(__dirname, '..lib/src/index.ts'),
            //      '/react-grid-layout-next/': path.resolve(__filename, '../lib/src')
        }
    } */
})
