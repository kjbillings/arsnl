import { isFunction } from 'lodash'

import { subscribe } from './subscribe'
import arsnl_namespace from '../namespace'

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
