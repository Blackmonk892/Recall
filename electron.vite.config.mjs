import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {
    build: {
      externalizeDeps: [],
      rollupOptions: {
        output: {
          format: 'es' // <--- FORCES ESM OUTPUT
        }
      }
    }
  },
  preload: {
    build: {
      externalizeDeps: [],
      rollupOptions: {
        output: {
          format: 'es' // <--- FORCES ESM OUTPUT
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  }
})
