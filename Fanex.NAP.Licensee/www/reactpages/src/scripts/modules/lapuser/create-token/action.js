import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'
import { SET_SELECTED_FUNCS, SET_IS_CHECK_GROUP } from './actionTypes'

function setSelectedFuncs(data) {
    return {
        type: SET_SELECTED_FUNCS,
        data: data
    };
}

function setIsCheckGroup(data) {
    return {
        type: SET_IS_CHECK_GROUP,
        data: data
    };
}

function createToken(param) {
    return () => Site.fetchData(param, 'LAPUserManagement/CreateToken');
}

export { setSelectedFuncs, setIsCheckGroup, createToken, toggleLoader }