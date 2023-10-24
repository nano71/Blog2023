import {defineConfig} from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
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
