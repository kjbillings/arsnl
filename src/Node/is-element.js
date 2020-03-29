import { isObject } from 'lodash'
import isDomNode from './is-dom-node'

export default obj => {
    try {
        const isHtml = obj instanceof HTMLElement
        const isComment = obj instanceof Comment
        const isSvg = obj instanceof SVGElement
        return isSvg || isHtml || isComment
    }
    catch(e){
        return isObject(obj)
            && isDomNode(obj)
            && isObject(obj.style)
            && isObject(obj.ownerDocument)
    }
}
