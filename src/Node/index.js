import {
    isObject,
    isFunction,
} from 'lodash'

import {
    subscribe,
    arsnl_namespace,
} from '../'

import createElement from './create-element'
import setContents from './set-contents'
import setStyle from './set-style'
import setRest from './set-rest'

export const waitForRender = fn => setTimeout(fn, 10)

export const resolveConfig = (config) => (
    isFunction(config)
        ? config()
        : config
)

const render = (el, config) => {
    setRest(el, config)
    setContents(el, config)
    setStyle(el, config)
    return el
}

const getNode = (config) => {
    const resolvedConfig = resolveConfig(config)
    const el = createElement(resolvedConfig)
    return render(el, resolvedConfig)
}

const handleOnLoad = (el, config) => {
    const resolvedConfig = resolveConfig(config)
    if (isFunction(resolvedConfig.onLoad)) {
        waitForRender(() => {
            resolvedConfig.onLoad(el)
        })
    }
}

const watchStates = (el, config, states) => {
    states.forEach((state) => {
        subscribe(state, () => {
            el = render(el, resolveConfig(config))
        })
    })
}

export const Node = (config={}, states=[]) => {
    const el = getNode(config)
    handleOnLoad(el, config)
    watchStates(el, config, states)
    return el
}
