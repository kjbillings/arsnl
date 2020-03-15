import {
    has,
    get,
    isString,
    isNumber,
    isArray,
    isObject,
} from 'lodash'

import {
    subscribe,
    State,
} from '../'
import { arsnl_namespace } from '../App'
import isElement from './is-element'
import isState from './is-state'

const renderElement = (el, contents) => {
    el.append(contents)
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
    el.append(child)
}

const render = (el, contents) => {
    if (isElement(contents)) {
        return renderElement(el, contents)
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
    const contents = config.r || config.innerHTML || config.contents || ''
    el.innerHTML = ''
    render(el, contents)
}

export default setContents
