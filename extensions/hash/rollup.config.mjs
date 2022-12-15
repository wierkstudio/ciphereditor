
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

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
    typescript(),
    nodeResolve({ browser: true }),
    terser()
  ]
}
