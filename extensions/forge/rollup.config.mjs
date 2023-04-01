
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

const ignoreEmptyId = '\0ignore_empty'
const ignore = (ignoreIds, options = {}) => ({
  resolveId: (source) => {
    if (source === ignoreEmptyId || ignoreIds.includes(source)) {
      return ignoreEmptyId
    }
    return null
  },
  load: (id) => {
    if (id === ignoreEmptyId) {
      return 'export default {}'
    }
    return null
  }
})

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
    ignore(['crypto']),
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    terser()
  ]
}
