﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from './action';

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: true
        };

        this.params = {
            licenseeName: ''
        };
    }

    _handleInputChange = (e) => {
        const target = e.target;
        const name = target.name;

        this.params[name] = target.value;
    }

    _handleOnActiveCheck = (e) => {
        this.setState({ isActive: e.target.checked });
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
            isActive: this.state.isActive,
            pageIndex: 1,
            pageSize: this.props.params.pageSize || 20,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        return (
            <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>Licensee Name</label>
                    <input type="text" name="licenseeName" maxLength='50' onChange={this._handleInputChange} onKeyPress={this._handleKeyPress} />
                </div>

            <div className="form-group">
                <label className="checkbox-inline">           
                    <input type="checkbox" name="isActive" onChange={this._handleOnActiveCheck} checked={this.state.isActive} />
                    Active
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
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);