import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppContainer from './AppContainer';
import reducer from './reducer';
import Store from '../../../lib/store';

const store = Store.createStore(reducer,
    {
        isLoading: false
    });

const App = () => {
    return (
        <Provider store={store}>
            <AppContainer/>
        </Provider>
    );
};

ReactDOM.render(<App/>, document.getElementById('app-container'));