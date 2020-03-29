import { isString } from 'lodash'

import {  Node } from '../Node'
import { navigate } from './navigate'

export const Link = ({ path, ...rest }) => (
    Node({
        ...rest,
        t: 'a',
        href: path || rest.href,
        onclick: e => {
            if (isString(path)) {
                e.preventDefault()
                navigate(path)
            }
        },
    })
)
