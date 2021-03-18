import namespace from '../namespace'

export const App = class App {
    constructor(config){
        this.title = config.title || ''
        this.id = config.id
        this.component = config.component
        this.router = config.router || console.error('ARSNL Error: router not found!')
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
        return this.router.render()
    }
}
