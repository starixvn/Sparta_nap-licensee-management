import { combineReducers } from 'redux'
import { isLoading } from '../../reducers/loaderReducer'

import createReducer from '../../lib/createReducer'
import { SET_PARAMS, GET_PRODUCT_LIST, SET_CHECKED_LIST } from './types'

const params = createReducer({}, {
    [SET_PARAMS](state, action) {
        return action.data;
    }
});

const productList = createReducer({}, {
    [GET_PRODUCT_LIST](state, action) {
        return action.data;
    }
});

const checkedList = createReducer({}, {
    [SET_CHECKED_LIST](state, action) {
        return action.data;
    }
});


export default combineReducers({ params, isLoading, productList, checkedList })