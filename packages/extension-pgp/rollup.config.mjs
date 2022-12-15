
import nodeResolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
global['__filename'] = __filename;

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
