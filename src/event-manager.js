import { remove } from 'lodash'

export default class EventManager {
    constructor () {
        this.listeners = []
        this.changeCount = 0
    }
    addListener (fn) {
        this.listeners.push(fn)
    }
    removeListener (fn) {
        remove(this.listeners, (listener) => listener === fn)
    }
    onChange (key, value) {
        this.listeners.forEach(fn => {
            fn(key, value)
            this.changeCount = this.changeCount + 1
        })
    }
}
