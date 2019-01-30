﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrencyParams } from '../action';
import Select from 'react-select';

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLicensee: null,
            selectedCurrency: null
        };
    }

    get isValid() {
        const { selectedLicensee, selectedCurrency } = this.state;

        return selectedLicensee || selectedCurrency;
    }

    onSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _submit() {
        const { selectedLicensee, selectedCurrency } = this.state;

        const params = {
            UserName: this.props.userName,
            LicenseeId: selectedLicensee ? selectedLicensee.value : 0,
            CurrencyId: selectedCurrency ? selectedCurrency.value : 0,
            TimeStamp: new Date().getTime()
        };

        this.props.setCurrencyParams(params);
    }

    render() {
        const { selectedLicensee, selectedCurrency } = this.state;
        const { licenseeList, currencyList } = this.props;
        const isValid = this.isValid;

        return (
        <div className="col-xs-12 form-inline filter-form">
                <div className="form-group">
                    <label>Licensee</label>
                    <Select instanceId="ddlLicensee"
                        value={selectedLicensee}
                        options={licenseeList}
                        className={isValid ? '' : 'has-error'}
                        onChange={(item) => this.setState({ selectedLicensee: item })} />
                </div>

                <div className="form-group">
                    <label>Currency</label>
                    <Select instanceId="ddlCurrency"
                        value={selectedCurrency}
                        options={currencyList}
                        className={isValid ? '' : 'has-error'}
                        onChange={(item) => this.setState({ selectedCurrency: item })} />
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit} disabled={!isValid}>Submit</button>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setCurrencyParams }, dispatch);
}
function mapStateToProps(state) {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);