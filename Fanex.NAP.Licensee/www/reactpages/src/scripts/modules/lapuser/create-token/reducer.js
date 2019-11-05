import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_USER_INFO, SET_TIME_REMAINING } from './actionTypes'

const userInfo = createReducer({}, {
    [SET_USER_INFO](state, action) {
        return action.data;
    }
});

const timeRemaining = createReducer({}, {
    [SET_TIME_REMAINING](state, action) {
        return action.data;
    }
});

export default combineReducers({ userInfo, timeRemaining, isLoading })