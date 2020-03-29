import {
    isObject,
    isString,
} from 'lodash'

export const xmlns = "http://www.w3.org/2000/svg"

export default config => {
    if (!isObject(config)) {
        return document.createDocumentFragment()
    }
    if (isString(config.t)) {
        if (config.t === 'comment') {
            return document.createComment(config.r || '')
        }
        if (config.t.includes('svg')) {
            return document.createElementNS(xmlns, config.t.replace('svg:', ''))
        }
    }
    return document.createElement(config.t || 'div')
}
