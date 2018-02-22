import { SET_GRID_DATA } from './actionTypes'
import Site from '../../../lib/site'
import { toggleLoader } from '../../../actions/loaderAction'

function getGridData(param) {
    return (dispatch) => {
        dispatch(toggleLoader(true));
        Site.fetchData(param, 'Vendor/GetVendorInfoList').then(response => {
            dispatch(setGridData(response.data));
            dispatch(toggleLoader(false));
        });
    };
}

function setGridData(data) {
    return {
        type: SET_GRID_DATA,
        data: data
    };
}

export { getGridData }