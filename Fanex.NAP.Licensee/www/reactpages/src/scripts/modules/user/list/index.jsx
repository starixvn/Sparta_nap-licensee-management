import React from 'react'
import ReactDOM from 'react-dom';
import AppContainer from './AppContainer'
import { Provider } from 'react-redux'
import reducer from './reducer'
import Store from '../../../lib/store'

const store = Store.createStore(reducer, { isLoading: false, params: {} });

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <Provider store={store}>
            <AppContainer />
          </Provider>
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app-container"));