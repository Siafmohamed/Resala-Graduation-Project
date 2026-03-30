import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from'path'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react(), tailwindcss()],
 resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
  dedupe: ['react', 'react-dom'],
 },
server: {
  proxy: {
    '/api': {
      target: 'http://resala.runasp.net',
      changeOrigin: true,
      secure: false,
      // We removed the rewrite line so that the /api prefix is preserved
      // and sent to the backend as part of the full URL.
    },
  },
},
})
