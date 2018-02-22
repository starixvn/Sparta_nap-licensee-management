import React from 'react';
import ReactDOM from 'react-dom';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return (<div className="loader" style={{ display: `${this.props.isLoading ? 'block' : 'none'}` }}>
            <div className="ui-widget-overlay ui-front"></div>
            <div className="icon-loading"></div>
        </div>)
    }
};