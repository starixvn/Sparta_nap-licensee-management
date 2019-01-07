import { SET_PARAMS } from './actionTypes'
import { toggleLoader } from '../../../actions/loaderAction'

function setParams(data) {
    return {
        type: SET_PARAMS,
        data: data
    };
}

export { setParams, toggleLoader }