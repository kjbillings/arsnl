import _routerEvents from './router-events'

export const navigate = (path, routerEvents=_routerEvents) => {
    if (path !== window.location.pathname) {
        window.history.pushState('', '', `${window.location.origin}${path}`)
        console.log('made it', routerEvents, path);
        routerEvents.onChange()
    }
}
