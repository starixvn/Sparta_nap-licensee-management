import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'

function updateVendor(param) {
    return () => Site.fetchData(param, 'LicenseeVendor/Edit');
}

export { updateVendor, toggleLoader }