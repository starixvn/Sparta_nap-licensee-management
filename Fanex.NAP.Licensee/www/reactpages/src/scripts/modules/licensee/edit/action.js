import { SET_LICENSEE, SET_PRODUCT_LIST } from './types';
import { toggleLoader } from '../../../actions/loaderAction';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

function setLicensee(data) {
    return {
        type: SET_LICENSEE,
        data: data
    };
}

function getProductList(licenseeID) {
    const url = 'LicenseeSetting/GetLicenseeProductList';

    return (dispatch) => {
        Site.fetchData({ LicenseeId: licenseeID }, url)
        .then(response => {
            dispatch(setProductList(response.data));
        }).catch(err => {
            Utility.showMessage('Please refresh');
            this._toggleLoader(false);
        });
    };
}

function setProductList(data) {
    return {
        type: SET_PRODUCT_LIST,
        data: data
    };
}

export { setLicensee, getProductList, setProductList, toggleLoader }