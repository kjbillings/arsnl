import { isString } from 'lodash'

import { r } from '../Node'
import { navigate } from './navigate'

export const Link = ({ path, ...rest }) => (
    r({
        ...rest,
        tag: 'a',
        href: path || rest.href,
        onclick: e => {
            if (isString(path)) {
                e.preventDefault()
                navigate(path)
            }
        },
    })
)
