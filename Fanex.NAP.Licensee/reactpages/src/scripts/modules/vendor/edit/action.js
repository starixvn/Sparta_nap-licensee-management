import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'
import { UPDATE_EXCLUSION_LIST } from './actionTypes'

function updateVendor(param) {
    return () => Site.fetchData(param, 'Vendor/Edit');
}

function updateOriginalExclusionList(data) {
    return {
        type: UPDATE_EXCLUSION_LIST,
        data
    };
}

export { updateVendor, toggleLoader, updateOriginalExclusionList }