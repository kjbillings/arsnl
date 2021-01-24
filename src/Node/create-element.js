import {
    isObject,
    isString,
} from 'lodash'

export const xmlns = "http://www.w3.org/2000/svg"

export default config => {
    let tag = config.tag

    if (!isObject(config)) {
        return document.createDocumentFragment()
    }
    if (isString(tag)) {
        tag = tag.toLowerCase()
        if (tag === 'comment') {
            return document.createComment(config.render || '')
        }
        if (tag.includes('svg')) {
            return document.createElementNS(xmlns, tag.replace('svg:', ''))
        }
    }
    return document.createElement(tag || 'div')
}
