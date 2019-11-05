import { toggleLoader } from '../../../actions/loaderAction'
import Site from '../../../lib/site'

function createToken(param) {
    return () => Site.fetchData(param, 'LAPUserManagement/CreateToken');
}

export { createToken, toggleLoader }