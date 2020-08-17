import { SET_PARAMS, CHANGE_TOTALWINLOSS } from './types'
import { toggleLoader } from '../../../actions/loaderAction'

function setParams(data) {
    return {
        type: SET_PARAMS,
        data: data
    };
}

function changeTotalWinloss(data) {
    return {
        type: CHANGE_TOTALWINLOSS,
        data: data
    }
}

export { setParams, changeTotalWinloss, toggleLoader }