import { combineReducers } from 'redux';
import { isLoading } from '../../../reducers/loaderReducer';

import createReducer from '../../../lib/createReducer';
import { SET_LICENSEE, SET_PRODUCT_LIST } from './types';

const licensee = createReducer({}, {
    [SET_LICENSEE](state, action) {
        return action.data;
    }
});

const productList = createReducer({}, {
    [SET_PRODUCT_LIST](state, action) {
        return action.data;
    }
});

export default combineReducers({ licensee, productList, isLoading })