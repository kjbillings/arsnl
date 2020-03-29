import arsnl_namespace from '../namespace'
import { omit } from 'lodash'

export const extract = (state) => (
    omit(state, [arsnl_namespace])
)
