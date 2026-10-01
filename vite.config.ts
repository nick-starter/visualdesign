import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base keeps assets working on GitHub Pages project sites
// (https://user.github.io/repo-name/) and locally.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 43127,
  },
  preview: {
    host: '0.0.0.0',
    port: 43127,
  },
})
