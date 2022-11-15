
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
    define: {
      'process.env.SENTRY_DSN': process.env.SENTRY_DSN !== undefined
        ? JSON.stringify(process.env.SENTRY_DSN)
        : undefined,
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV ?? 'production'),
      'process.env.RELEASE': JSON.stringify(
        process.env.RELEASE ?? 'unknown')
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
