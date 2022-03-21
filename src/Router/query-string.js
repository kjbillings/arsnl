import querystring from 'querystring'

import { omitBy, isUndefined } from 'lodash'

export default {
    parse: (search) => {
        search = search.replace(/^\?/, '')
        return querystring.parse(search)
    },
    stringify: obj => {
        return querystring.stringify(omitBy(obj, isUndefined))
    }
}
