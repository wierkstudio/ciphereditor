
import * as fs from 'fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Enable server HTTPS if local certificate files are present
const httpsKeyPath = '../../assets/localhost.key'
const httpsCertPath = '../../assets/localhost.crt'
const useHttps = fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath)

export default defineConfig(({ command, mode }) => {
  return {
    // Use relative URLs (useful for Electron)
    base: './',
    build: {
      outDir: 'build',
      sourcemap: true
    },
    server: {
      port: 3010,
      https: useHttps
        ? {
            key: fs.readFileSync(httpsKeyPath),
            cert: fs.readFileSync(httpsCertPath)
          }
        : false
    },
    plugins: [
      react()
    ]
  }
})
