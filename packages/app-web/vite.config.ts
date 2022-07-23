
import * as fs from 'fs'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import getRepositoryMetaData from 'git-repo-info'

// Enable server HTTPS if local certificate files are present
const httpsKeyPath = '../../assets/localhost.key'
const httpsCertPath = '../../assets/localhost.crt'
const useHttps = fs.existsSync(httpsKeyPath) && fs.existsSync(httpsCertPath)

export default defineConfig(({ command, mode }) => {
  const repositoryMetaData = getRepositoryMetaData()
  return {
    // Use relative URLs (useful for Electron)
    base: './',
    build: {
      outDir: 'build'
    },
    define: {
      'process.env.VERSION': JSON.stringify(repositoryMetaData.lastTag ?? 'N/A'),
      'process.env.VERSION_DATE': JSON.stringify(repositoryMetaData.committerDate),
      'process.env.VERSION_COMMIT': JSON.stringify(repositoryMetaData.sha)
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
