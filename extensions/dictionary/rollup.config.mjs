
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'

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
    json(),
    nodeResolve({ browser: true }),
    commonjs(),
    terser()
  ]
}
