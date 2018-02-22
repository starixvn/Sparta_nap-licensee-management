import { TOGGLE_LOADER } from './types'

export const toggleLoader = (show) => {
    return {
        type: TOGGLE_LOADER,
        data: show
    }
}