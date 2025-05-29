import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows access from network
    port: 5173,       // Optional: customize the port
    strictPort: true, // Optional: fail if port is taken
  }
})
