﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setParams } from '../common/action';
import Select from 'react-select';

const defaultState = Object.assign({}, window.initialState);

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLicensee: null,
            selectedFunction: null
        };
    }

    get isValid() {
        const { selectedLicensee, selectedFunction } = this.state;

        return selectedLicensee || selectedFunction;
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const { selectedLicensee, selectedFunction } = this.state;

        const params = {
            UserName: defaultState.userName,
            LicenseeId: selectedLicensee ? selectedLicensee.value : 0,
            FunctionId: selectedFunction ? selectedFunction.value : 0,
            TimeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedLicensee, selectedFunction } = this.state;
        const isValid = this.isValid;

        return (
        <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>Licensee</label>
                    <Select instanceId="ddlLicensee"
                        value={selectedLicensee}
                        options={defaultState.licenseeList}
                        className={isValid ? '' : 'has-error'}
                        onChange={(item) => this.setState({ selectedLicensee: item })} />
                </div>

                <div className="form-group">
                    <label>Currency</label>
                    <Select instanceId="ddlFunction"
                        value={selectedFunction}
                        options={defaultState.functionList}
                        className={isValid ? '' : 'has-error'}
                        onChange={(item) => this.setState({ selectedFunction: item })} />
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit} disabled={!isValid}>Submit</button>
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