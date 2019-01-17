import React from 'react';
import ReactDOM from 'react-dom';
import Form from './Form';

const defaultState = Object.assign({}, window.initialState);

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if (defaultState.operator === null) {
            return false;
        }

        return (
          <Form
            operator={defaultState.operator}
            siteNameList={defaultState.siteNameList}
            selectedSiteName={defaultState.selectedSiteName} />
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app-container"));