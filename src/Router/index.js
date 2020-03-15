import { match } from 'path-to-regexp'
import {
    get,
    isFunction,
    noop,
    isNull,
} from 'lodash'

import qs from './query-string'
import { Node, State, subscribe } from '../'
import { generateId } from './generate-id'
import EventManager from '../event-manager'

const EmptyRoute = () => ''

const routerEvents = new EventManager()

export const navigate = (path) => {
    if (path !== window.location.pathname) {
        window.history.pushState('', '', `${window.location.origin}${path}`)
        routerEvents.onChange()
    }
}

export class Router {
    constructor(routes){
        this.routes = routes || {}
        this.className = `arsnl-router-${generateId()}`
        this.route = State({ current: EmptyRoute })
        this.handleListeners()
        this.setRoute()
    }
    handleListeners () {
        this.is = State({ listening: false })
        this.listener = () => {
            this.isRendered()
                ? this.setRoute()
                : this.is.listening = false
        }
        subscribe(this.is, (key, value) => {
            value
                ? routerEvents.addListener(this.listener)
                : routerEvents.removeListener(this.listener)
        })
    }
    isRendered () {
        return !isNull(document.querySelector(`.${this.className}`))
    }
    setRoute () {
        const path = window.location.pathname
        let route = EmptyRoute
        const routeNames = Object.keys(this.routes).forEach((current) => {
            const matched = match(current, { decode: decodeURIComponent })(path)
            if (matched) {
                this.route.current = this.routes[current]
                this.route.currentParams = matched.params
            }
        })
    }
    render() {
        return Node(() => {
            if (!this.is.listening) {
                this.is.listening = true
            }
            return {
                className: this.className,
                r: this.route.current({
                    params: this.route.currentParams,
                    search: qs.parse(window.location.search),
                }),
            }
        }, [ this.route ])
    }
}

export { Link } from './Link'
