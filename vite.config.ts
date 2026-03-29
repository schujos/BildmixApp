import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Dev-Proxy: leitet /api/... an n8n weiter (löst CORS-Problem in der Entwicklung)
      '/api': {
        target: 'https://tiphar.app.n8n.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
      },
    },
  },
})
