import { isEmpty, isFunction } from 'lodash'

import { subscribe } from '../State'
import createElement from './create-element'
import setContents from './set-contents'
import setStyle from './set-style'
import setRest from './set-rest'
import waitForRender from '../wait-for-render'

export { default as isDomNode } from './is-dom-node'
export { default as isConfig } from './is-config'
export { default as waitForRender } from '../wait-for-render'

export const resolveConfig = (config, state, field, value) => (
    isFunction(config)
        ? config(state, field, value)
        : config
)

const render = (el, config) => {
    setRest(el, config)
    setContents(el, config)
    setStyle(el, config)
    return el
}

export const DomNode = (config={}, states=[], fields=[]) => {
    const resolvedConfig = resolveConfig(config)

    const el = createElement(resolvedConfig) 
    let renderedElement = render(el, resolvedConfig)
    
    if (isFunction(resolvedConfig.onLoad)) {
        waitForRender(() => {
            resolvedConfig.onLoad(renderedElement)
        })
    }
    
    states.forEach((state) => {
        subscribe(state, (field, value) => {
            if (isEmpty(fields) || fields.includes(field)) {
                const resolvedConfig = resolveConfig(config, state, field, value)
                renderedElement = render(renderedElement, resolvedConfig)
            }
        }, fields)
    })

    return renderedElement
}
