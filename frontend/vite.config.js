import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api requests to Django in dev, so the browser only ever
    // talks to one origin and we don't need CORS configuration.
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
})
