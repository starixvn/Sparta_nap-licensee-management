import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_PARAMS, SET_CHECKED_LIST } from './types'

const params = createReducer({}, {
    [SET_PARAMS](state, action) {
        return action.data;
    }
});

const checkedList = createReducer({}, {
    [SET_CHECKED_LIST](state, action) {
        return action.data;
    }
});

export default combineReducers({ params, checkedList, isLoading })