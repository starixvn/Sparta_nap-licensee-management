import Site from '../../../lib/site'

export function updateVendor(param) {
    return () => Site.fetchData(param, 'Vendor/Edit');
}