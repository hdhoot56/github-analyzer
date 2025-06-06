import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,  // Disable auto-open browser
    host: true,   // Listen on all network interfaces
    strictPort: true
  },
  preview: {
    port: 3000,
    host: true,
    strictPort: true
  }
})