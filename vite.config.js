import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-router': 'react-router/dist/main.js',
      'react-router-dom': 'react-router-dom/dist/main.js'
    }
  },
  optimizeDeps: {
    include: ['react-router', 'react-router-dom']
  }
})
