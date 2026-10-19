import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/products': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
      '/api/cart': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/orders': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/realms': {
        target: 'http://localhost:8443',
        changeOrigin: true,
      },
    },
  },
})
