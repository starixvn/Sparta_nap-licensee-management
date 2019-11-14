import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_SELECTED_FUNCS } from './actionTypes'

const selectedFunc = createReducer({}, {
    [SET_SELECTED_FUNCS](state, action) {
        return action.data;
    }
});

export default combineReducers({ selectedFunc, isLoading })