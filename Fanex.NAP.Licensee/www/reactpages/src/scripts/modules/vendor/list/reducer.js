import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_PARAMS, GET_FUNCTION_KEY_LIST, GET_VENDOR_ID } from './actionTypes'

const params = createReducer({}, {
    [SET_PARAMS](state, action) {
        return action.data;
    }
});

const functionKeyList = createReducer({}, {
    [GET_FUNCTION_KEY_LIST](state, action) {
        return action.data;
    }
});

const vendorId = createReducer({}, {
    [GET_VENDOR_ID](state, action) {
        return action.data;
    }
});

export default combineReducers({ params, isLoading, functionKeyList, vendorId })