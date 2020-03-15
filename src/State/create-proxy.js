import {
    get,
    set,
    keys,
    isNumber,
    isObject,
    isFunction,
} from 'lodash'

import { subscribe } from '../State'
import { arsnl_namespace } from '../App'

export default (object, onChange) => {
    if (isFunction(onChange)) {
        subscribe(object, onChange)
    }
    return (
        new Proxy(object, {
            set: (target, key, value) => {
                if (target[key] !== value) {
                    target[key] = value
                    object[arsnl_namespace].onChange(key, value)
                }
                return true
            },
        })
    )
}
