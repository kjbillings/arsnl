import _routerEvents from './router-events'

export const navigate = (path, routerEvents=_routerEvents) => {
    window.history.pushState({path}, document.title, `${window.location.origin}${path}`)
    routerEvents.onChange()
}
