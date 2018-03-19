import { TOGGLE_LOADER } from '../actions/types'
import createReducer from '../lib/createReducer'

const defaultValue = false;

export const isLoading = createReducer(defaultValue, {
    [TOGGLE_LOADER](state, action) {
        return action.data;
    }
})