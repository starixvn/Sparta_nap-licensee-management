import { Provider } from 'react-redux'
import Form from './Form';
import React from 'react';
import ReactDOM from 'react-dom';
import reducer from './reducer'
import Store from '../../../lib/store'

const defaultState = Object.assign({}, { selectedFunc: [], isCheckGroup: false });
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
                    user={defaultProps.user}
                    timeRemaining={defaultProps.timeRemaining}
                    isValid={defaultProps.isValid}
                    funcPer={defaultProps.funcPer}
                    oldFuncPer={defaultProps.user.UserPermission}
                    currency={defaultProps.currency}
                    oldCurrency={JSON.parse(defaultProps.user.Currency)} />
            </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app-container'));