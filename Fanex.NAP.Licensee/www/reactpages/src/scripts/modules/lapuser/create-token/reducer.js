import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'
import { SET_SELECTED_FUNCS } from './actionTypes'
import createReducer from '../../../lib/createReducer'

const selectedFunc = createReducer({}, {
    [SET_SELECTED_FUNCS](state, action) {
        return action.data;
    }
});

export default combineReducers({ selectedFunc, isLoading })