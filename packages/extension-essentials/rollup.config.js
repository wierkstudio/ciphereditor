
import replace from '@rollup/plugin-replace'
import typescript from '@rollup/plugin-typescript'
import { loadEnvConfig } from '@next/env'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

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
        Object.entries(loadEnvConfig(__dirname).combinedEnv)
          .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])
      )
    }),
    typescript(),
    nodeResolve(),
    terser()
  ]
}
