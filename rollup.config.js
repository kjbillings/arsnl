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
                    'isArray',
                    'includes',
                    'isEmpty',
                    'isEqual',
                    'isFunction',
                    'isNull',
                    'isNumber',
                    'isObject',
                    'isString',
                    'isUndefined',
                    'omit',
                    'omitBy',
                    'reject',
                    'remove',
                    'noop',
                ]
            }
        }),
    ],
}
