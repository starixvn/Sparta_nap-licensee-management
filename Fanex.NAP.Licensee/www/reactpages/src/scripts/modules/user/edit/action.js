import { SET_FUNCTION_PARAMS, SET_CURRENCY_PARAMS, SET_USER, SET_LICENSEE_LIST } from './types'
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

function setUser(data) {
    return {
        type: SET_USER,
        data: data
    };
}

function setLicenseeList(data) {
    return {
        type: SET_LICENSEE_LIST,
        data: data
    };
}

export { setFunctionParams, setCurrencyParams, setUser, toggleLoader, setLicenseeList }