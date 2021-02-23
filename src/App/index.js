import { Router } from '../Router'
import namespace from '../namespace'
import { waitForRender } from '../Node'

export const App = class App {
    constructor(config){
        this.title = config.title || ''
        this.id = config.id
        this.onAfterRender = config.onAfterRender
        this.component = config.component
        this.router = new Router(config.routes)
        this.globalize()
        this.renderApp()
    }
    globalize () {
        window[namespace] = this
    }
    getRootElement() {
        return document.getElementById(this.id)
    }
    renderApp () {
        this.getRootElement()
            .append(this.component(this))
    }
    renderRoutes () {
        this.beforeRender()
        return this.router.render()
    }
    afterRender () {
        if (this.onAfterRender) {
            this.onAfterRender()
        }
    }
    beforeRender () {
        if (this.onBeforeRender) {
            this.onBeforeRender()
        }
    }
}
