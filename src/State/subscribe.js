import arsnl_namespace from '../namespace'

export const subscribe = (state, fn) => (
    state[arsnl_namespace].addListener(fn)
)
