import { combineReducers } from 'redux'
import { isLoading } from '../../../reducers/loaderReducer'

import createReducer from '../../../lib/createReducer'
import { SET_VENDOR_INFO, SET_FUNCTION_LIST, UPDATE_EXCLUSION_LIST } from './actionTypes'

const vendorInfo = createReducer({}, {
    [SET_VENDOR_INFO](state, action) {
        return action.data;
    }
});

const functionKeyList = createReducer([], {
    [SET_FUNCTION_LIST](state, action) {
        return action.data;
    }
});

const originalExclusionList = createReducer("", {
    [UPDATE_EXCLUSION_LIST](state, action) {
        return action.data;
    }
})

export default combineReducers({ vendorInfo, functionKeyList, originalExclusionList, isLoading })