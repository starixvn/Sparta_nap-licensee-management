import { SET_GRID_DATA } from './actionTypes'
import Site from '../../../lib/site'

export function getGridData(param) {
    return (dispatch) => {
        Site.fetchData(param, 'Vendor/GetVendorInfoList').then(response => {
            dispatch(setGridData(response.data));
        });
    };
}

function setGridData(data) {
    return {
        type: SET_GRID_DATA,
        data: data
    };
}