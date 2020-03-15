import { isObject } from 'lodash'

export default obj => {
    try {
        return obj instanceof HTMLElement
    }
    catch(e){
        return isObject(obj)
            && (obj.nodeType === 1)
            && isObject(obj.style)
            && isObject(obj.ownerDocument)
    }
}
