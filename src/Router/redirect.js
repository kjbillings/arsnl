import { navigate } from './navigate'
import waitForRender from '../wait-for-render'

export default routerEvents => (
    path => (
        waitForRender(() => {
            navigate(path, routerEvents)
        })
    )
)
