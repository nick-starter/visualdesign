import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Project Pages site: https://nick-starter.github.io/visualdesign/
// GITHUB_ACTIONS is set automatically in the deploy workflow.
const base = process.env.GITHUB_ACTIONS ? '/visualdesign/' : '/'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  server: {
    host: '0.0.0.0',
    port: 43127,
  },
  preview: {
    host: '0.0.0.0',
    port: 43127,
  },
})
