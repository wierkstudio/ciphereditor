
import nextEnv from '@next/env'
import nodeResolve from '@rollup/plugin-node-resolve'
import path from 'path'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const envDir = path.resolve('..', '..')

export default {
  input: './src/index.ts',
  output: {
    file: './build/extension.js',
    format: 'amd',
    amd: {
      id: 'index'
    },
    sourcemap: true
  },
  plugins: [
    replace({
      preventAssignment: true,
      values: Object.fromEntries(
        Object.entries(nextEnv.loadEnvConfig(envDir).combinedEnv)
          .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
      )
    }),
    typescript(),
    nodeResolve({ browser: true }),
    terser()
  ]
}
