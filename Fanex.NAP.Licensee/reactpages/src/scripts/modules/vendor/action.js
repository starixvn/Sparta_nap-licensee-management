import axios from 'axios'

import { SET_GRID_DATA } from './actionTypes'

const fetchData = () => {
    const url = window.rootUrl + 'Vendor/GetVendorInfoList';
    return axios.post(url, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    });
}

export function getGridData() {
    return (dispatch) => {
        fetchData().then(response => {
            dispatch(setGridData(response.data));
        });
    };
}

export function setGridData(data) {
    return {
        type: SET_GRID_DATA,
        data: data
    };
}