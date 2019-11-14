import { SET_SELECTED_FUNCS } from './actionTypes'
import Site from '../../../lib/site'

function setSelectedFuncs(data) {
    return {
        type: SET_SELECTED_FUNCS,
        data: data
    };
}

function createAccount(param) {
    return () => Site.fetchData(param, 'LAPUserManagement/AddNewUser');
}

export { setSelectedFuncs, createAccount }