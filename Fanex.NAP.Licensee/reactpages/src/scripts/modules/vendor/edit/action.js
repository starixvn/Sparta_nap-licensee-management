import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'

function updateVendor(param) {
    return () => Site.fetchData(param, 'Vendor/Edit');
}

export { updateVendor, toggleLoader }