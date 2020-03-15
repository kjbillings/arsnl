import qs from 'querystring'

import { omitBy, isUndefined } from 'lodash'

export default {
    parse: (search) => {
        search = search.replace(/^\?/, '')
        return qs.parse(search)
    },
    stringify: obj => {
        return qs.stringify(omitBy(obj, isUndefined))
    }
}
