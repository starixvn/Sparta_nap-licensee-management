import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'
import { SET_SELECTED_FUNCS } from './actionTypes'

function setSelectedFuncs(data) {
    return {
        type: SET_SELECTED_FUNCS,
        data: data
    };
}

function createToken(param) {
    return () => Site.fetchData(param, 'LAPUserManagement/CreateToken');
}

export { setSelectedFuncs, createToken, toggleLoader }