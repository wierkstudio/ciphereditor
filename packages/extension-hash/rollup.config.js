
import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default {
  input: './src/index.ts',
  output: {
    file: './build/extension-hash.js',
    format: 'amd',
    amd: {
      id: 'index'
    },
    sourcemap: true
  },
  plugins: [
    typescript(),
    nodeResolve(),
    terser()
  ]
}
