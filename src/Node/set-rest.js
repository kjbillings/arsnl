import { forEach, includes, isFunction, isNull } from 'lodash'
import arsnl_namespace from '../namespace'
import { xmlns } from './create-element'

const INTERNAL_ATTRIBUTES = [
    arsnl_namespace,
    'style',
    'tag',
    'render',
    'onLoad',
    'dangerouslysetinnerhtml',
    'dangerouslySetInnerHtml',
    'dangerouslySetInnerHTML',
]

const isSameType = (a, b) => typeof a === typeof b

const isSameFn = (a, b) => (
    isFunction(a)
    && isFunction(b)
    && a.toString() === b.toString()
)

export default (el, config) => {
    forEach(config, (value, key) => {
        if (!includes(INTERNAL_ATTRIBUTES, key)) {
            const lcKey = key.toLowerCase()
            if (isSameFn(el[key], value) || isSameFn(el[lcKey], value)) {
                return
            }
            if (el[lcKey] === null) {
                el[lcKey] = value
                return
            }
            if (el[key] === null) {
                el[key] = value
                return
            }
            el.setAttribute(key, value)
        }
    })
}
