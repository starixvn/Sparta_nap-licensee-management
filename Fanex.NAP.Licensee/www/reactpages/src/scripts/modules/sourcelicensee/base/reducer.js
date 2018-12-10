import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_PARAMS } from './types'

const params = createReducer({}, {
    [SET_PARAMS](state, action) {
        return action.data;
    }
});

export default combineReducers({ params, isLoading })