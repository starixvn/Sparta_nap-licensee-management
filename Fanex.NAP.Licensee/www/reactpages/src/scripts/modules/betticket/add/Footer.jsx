import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from './action';

export class Footer extends Component {
    constructor(props) {
        super(props);

        this.params = {
            userName: '',
            isClosed: ''
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this._submit();
    }

    _submit() {
        alert("Hello Mark, Submited");
    }

    onReset = (e) => {
        e.preventDefault();

        this._reset();
    }

    _reset() {
        alert("Hello Mark, Reset");
    }

    render() {
        return (
        <div style={{ display: 'inline-block', float: 'right' }}>
            <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
            <a className="btn-back" href={window.rootUrl + 'BetTicketVolumeControl/Index'}>Back To List</a>
            <button type="button" className="btn-back" onClick={this.onReset} >Reset</button>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);