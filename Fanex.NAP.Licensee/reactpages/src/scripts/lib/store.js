import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'

export default class Store {
    static createStore(reducer, initialState) {
        const enhancer = compose(
            applyMiddleware(
                thunkMiddleware, // lets us dispatch() functions
            )
        );

        return createStore(reducer, initialState, enhancer);
    }
}