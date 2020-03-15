import { omit } from 'lodash'
import EventManager from '../event-manager'
import { arsnl_namespace } from '../App'

import createProxy from './create-proxy'

export const State = (object={}, onChange) => {
    object[arsnl_namespace] = new EventManager()
    return createProxy(object, onChange)
}

export const subscribe = (state, fn) => (
    state[arsnl_namespace].addListener(fn)
)

export const extract = (state) => (
    omit(state, [arsnl_namespace])
)
