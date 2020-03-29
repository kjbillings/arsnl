import { includes } from 'lodash'
import arsnl_namespace from '../namespace'
import { xmlns } from './create-element'

const SHORTHANDS = [
    arsnl_namespace,
    't',
    'r',
    's',
    'c',
    'onLoad',
]

export default (el, config) => {
    Object.keys(config).forEach((key) => {
        const keyToSet = key === 'c'
            ? 'class'
            : key
        if (!includes(SHORTHANDS, keyToSet)) {
            el.setAttribute(keyToSet, config[key])
        }
    })
}
