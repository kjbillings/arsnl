import commonjs from 'rollup-plugin-commonjs'

export default {
    input: 'src/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs',
    },
    external: [
        'lodash',
        'path-to-regexp',
        'querystring'
    ],
    plugins: [
        commonjs()
    ]
}
