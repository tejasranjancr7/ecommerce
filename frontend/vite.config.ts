import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/products': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
      },
      '/api/cart': {
        target: 'http://127.0.0.1:8083',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://127.0.0.1:8083',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true,
      },
      '/realms': {
        target: 'http://127.0.0.1:8443',
        changeOrigin: true,
      },
    },
  },
})
