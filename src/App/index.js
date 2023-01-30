import { Router } from '../Router'
import namespace from '../namespace'

export const App = class App {
    constructor({
        metadata,
        title,
        id,
        component,
        routes,
        onInit,
        onBeforeRouteRender,
        onAfterRouteRender,
    }) {
        this.metadata = metadata || {}
        this.title = title || ''
        this.id = id
        this.component = component
        this.router = new Router(routes, {
            onInit: onInit,
            onBeforeRouteRender: onBeforeRouteRender,
            onAfterRouteRender: onAfterRouteRender,
        })
        this.globalize()
        this.injectApp()
    }
    globalize () {
        window[namespace] = this
    }
    getRootElement() {
        return document.getElementById(this.id)
    }
    injectApp () {
        this.getRootElement()
            .append(this.component(this))
    }
    renderRoutes () {
        return this.router.render()
    }
}
