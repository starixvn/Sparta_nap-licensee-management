import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_USER_INFO } from './actionTypes'

const user = createReducer({}, {
    [SET_USER_INFO](state, action) {
        return action.data;
    }
});

export default combineReducers({ user, isLoading })