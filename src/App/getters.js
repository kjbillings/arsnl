import { get } from 'lodash'
import namespace from '../namespace'
export const getApp = () => get(window, namespace)
export const getRouter = () => getApp().router
