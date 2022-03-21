import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { main } from './package.json'
import builtins from 'rollup-plugin-node-builtins'

export default {
    input: 'src/index.js',
    external: [
        'lodash',
    ],
    output: {
        file: main,
        format: 'cjs',
        name:'arsnl',
        globals: {
            lodash: 'lodash',
        }
    },
    plugins: [
        builtins(),
        resolve({
            preferBuiltins: true,
        }),
        commonjs(),
    ],
}
