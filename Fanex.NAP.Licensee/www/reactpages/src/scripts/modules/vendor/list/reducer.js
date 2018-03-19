import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_GRID_DATA } from './actionTypes'

const gridData = createReducer({}, {
    [SET_GRID_DATA](state, action) {
        return action.data;
    }
});

export default combineReducers({ gridData, isLoading })