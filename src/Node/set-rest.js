import { includes, keys } from 'lodash'
import { arsnl_namespace } from '../App'

const SHORTHANDS = [
    arsnl_namespace,
    't',
    'r',
    's',
    'onLoad',
]

export default (el, config) => {
    Object.keys(config).forEach((key) => {
        if (!includes(SHORTHANDS, key)) {
            el[key] = config[key]
        }
    })
}
