import { isObject } from 'lodash'

export default config => {
    if (isObject(config)) {
        return document.createElement(config.t || 'div')
    }
    return document.createDocumentFragment()
}
