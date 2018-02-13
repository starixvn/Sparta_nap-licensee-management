import axios from 'axios'

import { SET_GRID_DATA } from './actionTypes'

const fetchData = (param) => {
    const url = window.rootUrl + 'Vendor/GetVendorInfoList';
    return axios.post(url, param && param.data, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

export function getGridData(param) {
    return (dispatch) => {
        fetchData(param).then(response => {
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