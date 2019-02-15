import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_FUNCTION_PARAMS, SET_CURRENCY_PARAMS, SET_USER, SET_LICENSEE_LIST } from './types'

const functionParams = createReducer({}, {
    [SET_FUNCTION_PARAMS](state, action) {
        return action.data;
    }
});

const currencyParams = createReducer({}, {
    [SET_CURRENCY_PARAMS](state, action) {
        return action.data;
    }
});

const user = createReducer({}, {
    [SET_USER](state, action) {
        return action.data;
    }
});

const licenseeList = createReducer({}, {
    [SET_LICENSEE_LIST](state, action) {
        return action.data;
    }
});

export default combineReducers({ functionParams, currencyParams, user, isLoading, licenseeList })