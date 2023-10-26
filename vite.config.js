import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), viteCompression()],
    optimizeDeps: {
        include: ["/src/utils/log.js"],
    },
    css: {
        preprocessorOptions: {
            less: {
                charset: false,
                additionalData: `@import "/src/reference.less";`,
            }
        },
    },
})
