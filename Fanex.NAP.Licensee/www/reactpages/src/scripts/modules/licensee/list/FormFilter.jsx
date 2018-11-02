﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams } from './action';

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: true
        };

        this.params = {
            licenseeName: '',
            isActive: true,
            isLaunched: false
        };
    }

    _handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    _handleOnActiveCheck = (e) => {
        this.setState({ isActive: e.target.checked });
        this._handleOnCheck(e);
    }

    _handleOnCheck = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.checked;
    }

    _handleKeyPress = (e) => {
        if (e.charCode === 13) {
            e.preventDefault();
            
            this._submit();
        }
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const params = {
            licenseeName: this.params.licenseeName,
            isActive: this.params.isActive,
            isLaunched: this.params.isLaunched,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        return (
            <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>Licensee Name</label>
                    <input type="text" name="licenseeName" onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} />
                </div>

            <div className="form-group">
                <label className="checkbox-inline">           
                    <input type="checkbox" name="isActive" onChange={this._handleOnActiveCheck} checked={this.state.isActive} />
                    Is Active
                </label>
            </div>

            <div className="form-group">
                <label className="checkbox-inline">           
                    <input type="checkbox" name="isLaunched" onChange={this._handleOnCheck} />
                    Is Launched
                </label>
            </div>

            <div className="form-group">
                <button type="button" className="btn btn-primary" onClick={this._handleSubmit}>Submit</button>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);