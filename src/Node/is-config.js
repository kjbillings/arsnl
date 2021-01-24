import {
    isArray,
    isFunction,
    isObject,
    isNull,
    isString,
    isUndefined
} from 'lodash'

import isDomNode from './is-dom-node'

const isConfig = args => (
    (
        !isUndefined(args)
        && !isNull(args)
        && !isString(args)
        && isObject(args)
        && !isArray(args)
        && !isDomNode(args)
    ) || (
        isFunction(args)
        && isConfig(args())
    )
)

export default isConfig
