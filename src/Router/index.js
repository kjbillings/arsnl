import { match } from 'path-to-regexp'
import { get, isNull } from 'lodash'

import qs from './query-string'
import { Node } from '../Node'
import { State, subscribe } from '../State'
import { generateId } from './generate-id'
import routerEvents from './router-events'
import getRedirectHandler from './redirect'

const EmptyRoute = () => ''

const PAGE_NOT_FOUND = '/404'

export { Link } from './Link'

export class Router {
    constructor (routes) {
        this.routes = routes || {}
        this.className = `arsnl-router-${generateId()}`
        this.route = State({
            current: get(routes, PAGE_NOT_FOUND, EmptyRoute)
        })
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
    findRoute (path) {
        const output = {}
        Object.keys(this.routes)
            .forEach((current) => {
                const matched = match(current, {
                    decode: decodeURIComponent
                })(path)
                if (matched) {
                    output.found = current
                    output.params = matched.params
                }
            })
        return output
    }
    setRoute () {
        const path = window.location.pathname
        let route = EmptyRoute
        const {
            found,
            params,
        } = this.findRoute(path)
        if (found) {
            this.route.current = this.routes[found]
            this.route.currentParams = params
        } else {
            this.route.current = get(this.routes, PAGE_NOT_FOUND, EmptyRoute)
        }
    }
    render () {
        return Node(() => {
            if (!this.is.listening) {
                this.is.listening = true
            }
            return {
                c: this.className,
                r: this.route.current({
                    params: this.route.currentParams,
                    search: qs.parse(window.location.search),
                    redirect: getRedirectHandler(routerEvents),
                }),
            }
        }, [
            this.route
        ])
    }
}
