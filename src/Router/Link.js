import { isString } from 'lodash'

import { DomNode } from '../Node'
import { navigate } from './navigate'

export const Link = ({ path, tag='a', ...rest }) => (
    DomNode({
        ...rest,
        tag,
        href: path || rest.href,
        onclick: e => {
            if (isString(path)) {
                e.preventDefault()
                navigate(path)
            }
        },
    })
)
