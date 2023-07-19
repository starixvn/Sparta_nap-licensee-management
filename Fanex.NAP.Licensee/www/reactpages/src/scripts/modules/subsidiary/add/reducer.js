import { combineReducers } from 'redux';
import { isLoading } from '../../../reducers/loaderReducer';

import createReducer from '../../../lib/createReducer';
import actionType from './types';

const licensees = createReducer([],
    {
        [actionType.SET_LICENSEES](state, action) {
            return action.data;
        }
    });

const selectedLicensee = createReducer(null,
    {
        [actionType.SET_SELECT_LICENSEE](state, action) {
            return action.data;
        }
    });

const currencies = createReducer([],
    {
        [actionType.SET_CURRENCIES](state, action) {
            return action.data;
        }
    });

const selectedCurrency = createReducer(null,
    {
        [actionType.SET_SELECT_CURRENCY](state, action) {
            return action.data;
        }
    });

const sourceAgent = createReducer('Agent01',
    {
        [actionType.SET_SOURCE_AGENT](state, action) {
            return action.data;
        }
    });

const agencies = createReducer([],
    {
        [actionType.SET_AGENCIES](state, action) {
            return action.data;
        }
    });

const gridMessages = createReducer([],
    {
        [actionType.ADD_GRID_MESSAGE](state, action) {
            return [...state, action.data];
        },
        [actionType.SET_GRID_MESSAGE](state, action) {
            return action.data;
        }
    });

export default combineReducers({
    isLoading,
    licensees,
    selectedLicensee,
    currencies,
    selectedCurrency,
    sourceAgent,
    agencies,
    gridMessages
});