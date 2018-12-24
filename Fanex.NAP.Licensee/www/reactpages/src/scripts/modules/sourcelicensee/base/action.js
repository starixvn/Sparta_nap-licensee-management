import { SET_PARAMS, SET_CHECKED_LIST } from './types'
import { toggleLoader } from '../../../actions/loaderAction'

function setParams(data) {
    return {
        type: SET_PARAMS,
        data: data
    };
}

function setCheckedList(data) {
    return {
        type: SET_CHECKED_LIST,
        data: data
    };
}

export { setParams, setCheckedList, toggleLoader }