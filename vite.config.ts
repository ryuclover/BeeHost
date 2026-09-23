import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        games: resolve(__dirname, 'games.html'),
        plans: resolve(__dirname, 'plans.html'),
        features: resolve(__dirname, 'features.html'),
        community: resolve(__dirname, 'community.html'),
        support: resolve(__dirname, 'support.html'),
      },
    },
  },
})
