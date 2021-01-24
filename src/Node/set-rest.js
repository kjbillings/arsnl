import { includes } from 'lodash'
import arsnl_namespace from '../namespace'
import { xmlns } from './create-element'

const SHORTHANDS = [
    arsnl_namespace,
    'style',
    'tag',
    'render',
    'onLoad',
]

const eventKeyRegex = /on([A-Z]\w+)/

export default (el, config) => {
    Object.keys(config).forEach((key) => {
        const lowerCaseKey = key.toLowerCase()
        if (!includes(SHORTHANDS, key)) {
            if (key === 'innerHTML') {
                el.innerHTML = config[key]
                return
            }
            if (key === 'disabled') {
                el.disabled = config[key]
                return
            }
            if (el[lowerCaseKey] === null) {
                el[lowerCaseKey] = config[key]
                return
            }
            if (el[key] === null) {
                el[key] = config[key]
                return
            }
            el.setAttribute(key, config[key])
        }
    })
}
