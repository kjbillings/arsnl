import { Router } from './Router'
import namespace from './namespace'

export const App = class App {
    constructor(config){
        this.id = config.id
        this.component = config.component
        this.router = new Router(config.routes)
        this.theme = config.theme
        this.setGlobals()
        this.renderApp()
    }
    setGlobals () {
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
        return this.router.render()
    }
}
