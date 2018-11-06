import React from 'react';
import ReactDOM from 'react-dom';
import ImportPage from './ImportPage';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <ImportPage />
        );
    }
}

ReactDOM.render(<App />, document.getElementById("app-container"));