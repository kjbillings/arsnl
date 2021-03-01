import { get, isFunction, isString, isNumber, isArray, isObject } from 'lodash'

import { subscribe, State } from '../State'
import arsnl_namespace from '../namespace'
import isElement from './is-element'
import isState from './is-state'

const append = (target, appendage) => {
    if (isFunction(target.append)) {
        target.append(appendage)
    }
}

const renderArray = (el, contents) => {
    for (var i = 0; i < contents.length; i++) {
        render(el, contents[i])
    }
}

const renderStateObject = (el, contents) => {
    const firstProperty = Object.keys(contents)[0]
    let child = document.createTextNode(get(contents, firstProperty, ''))
    subscribe(contents, (key, value) => {
        child.replaceData(0, child.length, value)
    })
    el.append(child)
}

const renderString = (el, contents) => {
    const child = document.createTextNode(contents)
    append(el, child)
}

const render = (el, contents) => {
    if (contents instanceof SVGElement) {
        return el.appendChild(contents)
    }
    if (isElement(contents)) {
        return append(el, contents)
    }
    if (isArray(contents)) {
        return renderArray(el, contents)
    }
    if (isObject(contents) && isState(contents)){
        return renderStateObject(el, contents)
    }
    if (isNumber(contents) || isString(contents)) {
        return renderString(el, contents)
    }
}

const setContents = (el, config) => {
    if (config.dangerouslySetInnerHtml) {
        el.innerHTML = config.dangerouslySetInnerHtml
    } else {
        const contents = config.render || ''
        el.innerHTML = ''
        render(el, contents)
    }
}

export default setContents
