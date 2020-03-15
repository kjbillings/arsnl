import { isString } from 'lodash'

import {  Node } from '../'
import { navigate } from './'

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
