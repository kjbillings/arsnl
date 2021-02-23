import resolve from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { main } from './package.json'

export default {
    input: 'src/index.js',
    output: {
        file: main,
        format: 'cjs',
    },
    plugins: [
        resolve({
            preferBuiltins: false,
        }),
        commonjs({
            namedExports: {
                'node_modules/lodash/lodash.js': [
                    'forEach',
                    'get',
                    'set',
                    'includes',
                    'isArray',
                    'isFunction',
                    'isNull',
                    'isNumber',
                    'isEqual',
                    'isObject',
                    'isString',
                    'isUndefined',
                    'omit',
                    'omitBy',
                    'remove',
                ]
            }
        }),
    ],
}
