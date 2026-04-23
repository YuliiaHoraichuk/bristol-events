import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // lightningcss ships a runtime `require('../pkg')` which esbuild can't
  // resolve during dependency optimization. Exclude it so Vite won't try to
  // pre-bundle it. Also mark it as external for SSR builds.
  optimizeDeps: {
    exclude: ['lightningcss']
  },
  ssr: {
    noExternal: ['lightningcss']
  }
})
