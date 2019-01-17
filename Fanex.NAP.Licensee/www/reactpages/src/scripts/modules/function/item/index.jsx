﻿import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';

const defaultState = Object.assign({}, window.initialState);

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (defaultState.function === null) {
            return false;
        }

        return (
          <Form 
            function={defaultState.function} 
            parentFunctionList={defaultState.parentFunctionList}
            selectedParent={defaultState.selectedParent} />
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app-container'));