import { UPDATE_VENDOR_INFO, SET_VENDOR_INFO } from './actionTypes'
import Site from '../../../lib/site'

export function updateVendor(param) {
    return () => Site.fetchData(param, 'Vendor/Edit');
}