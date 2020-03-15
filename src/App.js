import { set } from 'lodash'

import { Router } from './Router'

export const arsnl_namespace = '__ARSNL__'

export const App = class App {
    constructor(config){
        this.id = config.id
        this.component = config.component
        this.router = new Router(config.routes)
        this.renderApp()
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
