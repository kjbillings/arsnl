import { match } from 'path-to-regexp'
import { get, isNull, reject, isEmpty } from 'lodash'

import qs from './query-string'
import { r } from '../Node'
import waitForRender from '../wait-for-render'
import { getApp } from '../App/getters'
import { State, subscribe } from '../State'
import { generateId } from './generate-id'
import routerEvents from './router-events'
import getRedirectHandler from './redirect'
import { navigate } from './navigate'

const EmptyRoute = () => ''

const PAGE_NOT_FOUND = '/404'

export { Link } from './Link'
export { navigate } from './navigate'

export class Router {
    constructor (routes) {
        this.routes = routes || {}
        this.className = `arsnl-router-${generateId()}`
        this.route = State({
            current: {
                params: {},
                component: this.get404(),
            },
        })
        this.handleListeners()
        this.setRoute()
        this.subscribeToStateChanges()
    }
    subscribeToStateChanges () {
        window.addEventListener("popstate", () => {
            window.location.pathname = window.location.pathname
        })
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
    get404 () {
        return get(this.routes, PAGE_NOT_FOUND, EmptyRoute)
    }
    setRoute () {
        const path = window.location.pathname
        let route = EmptyRoute
        const {
            found,
            params,
        } = this.findRoute(path)
        if (found) {
            this.route.current = {
                params,
                component: this.routes[found],
            }
        } else {
            this.route.current = this.get404()
        }
    }
    afterRender () {
        getApp().afterRender()
    }
    setTitle (str) {
        const title = reject([getApp().title, str], isEmpty).join(' | ')
        document.title = title
    }
    render () {
        waitForRender(() => this.afterRender())
        return r(() => {
            if (!this.is.listening) {
                this.is.listening = true
            }
            return {
                class: this.className,
                render: this.route.current.component({
                    setTitle: str => this.setTitle(str),
                    params: this.route.current.params,
                    search: qs.parse(window.location.search),
                    redirect: getRedirectHandler(routerEvents),
                }),
            }
        }, [ this.route ])
    }
}
