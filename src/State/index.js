import EventManager from '../event-manager'
import arsnl_namespace from '../namespace'
import createProxy from './create-proxy'

export { subscribe } from './subscribe'
export { extract } from './extract'

export const State = (object={}, onChange) => {
    object[arsnl_namespace] = new EventManager()
    return createProxy(object, onChange)
}
