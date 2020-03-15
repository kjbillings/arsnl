import {
    set,
    isObject,
} from 'lodash'

import { subscribe, } from '../State'
import { waitForRender } from '../Node'
import { arsnl_namespace } from '../App'
import isState from './is-state'

export default (el, config) => {
    const style = config.s

    const setProperty = (key, value) => {
        waitForRender(() => {
            if (key !== arsnl_namespace) {
                el.style[key] = value
            }
        })
    }

    if (isObject(style)) {
        if (isState(style)) {
            subscribe(style, (key, value) => {
                setProperty(key, value)
            })
        }
        Object.keys(style).forEach((key) => {
            setProperty(key, style[key])
        })
    }
}
