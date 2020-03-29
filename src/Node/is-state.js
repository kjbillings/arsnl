import { isObject } from 'lodash'

import arsnl_namespace from '../namespace'

export default (obj={}) => isObject(obj[arsnl_namespace])
