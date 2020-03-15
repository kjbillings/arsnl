import { isObject } from 'lodash'

import { arsnl_namespace } from '../App'

export default (obj={}) => isObject(obj[arsnl_namespace])
