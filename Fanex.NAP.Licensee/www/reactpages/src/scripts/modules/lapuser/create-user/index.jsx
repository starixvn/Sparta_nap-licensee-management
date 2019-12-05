import { Provider } from 'react-redux'
import Form from './Form';
import React from 'react';
import ReactDOM from 'react-dom';
import reducer from './reducer'
import Store from '../../../lib/store'

const defaultState = Object.assign({}, { selectedFunc: [] });
const defaultProps = Object.assign({}, window.initialState);
const store = Store.createStore(reducer, defaultState);

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Provider store={store}>
                <Form 
                    vendorId={defaultProps.vendorId}
                    siteName={defaultProps.siteName}
                    userID={defaultProps.userID}
                    isValid={defaultProps.isValid}
                    isExist={defaultProps.isExist}
                    funcPer={defaultProps.funcPer}
                    currency={defaultProps.currency}
                    />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app-container'));