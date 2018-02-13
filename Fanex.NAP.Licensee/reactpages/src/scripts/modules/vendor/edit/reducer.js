import { combineReducers } from 'redux'

import createReducer from '../../../lib/createReducer'
import { SET_VENDOR_INFO } from './actionTypes'

const vendorInfo = createReducer({}, {
    [SET_VENDOR_INFO](state, action) {
        return action.data;
    }
});

export default combineReducers({ vendorInfo })