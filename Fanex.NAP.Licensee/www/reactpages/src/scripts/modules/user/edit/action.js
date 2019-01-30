import { SET_FUNCTION_PARAMS, SET_CURRENCY_PARAMS } from './types'
import { toggleLoader } from '../../../actions/loaderAction'

function setFunctionParams(data) {
    return {
        type: SET_FUNCTION_PARAMS,
        data: data
    };
}

function setCurrencyParams(data) {
    return {
        type: SET_CURRENCY_PARAMS,
        data: data
    };
}

export { setFunctionParams, setCurrencyParams, toggleLoader }