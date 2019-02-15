import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setFunctionParams } from '../action';

import Select from 'react-select';

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
            LicenseeId: selectedLicensee ? selectedLicensee.value : 0,
            FunctionId: selectedFunction ? selectedFunction.value : 0,
            TimeStamp: new Date().getTime()
        };

        this.props.setFunctionParams(params);
    }

    render() {
        const { selectedLicensee, selectedFunction } = this.state;
        const { licenseeList, functionList } = this.props
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
                    <label>Function</label>
                    <Select instanceId="ddlFunction"
                        value={selectedFunction}
                        options={functionList}
                        className={isValid ? '' : 'has-error'}
                        onChange={(item) => this.setState({ selectedFunction: item })} />
                </div>

                <div className="form-group">
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit} disabled={!isValid}>Submit</button>
                </div>

                <div className='form-group full-width'>
                    <sup className='red'>*</sup>: Licensee is inactive or not active for LRF.
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setFunctionParams }, dispatch);
}
function mapStateToProps(state) {
    const { licenseeList } = state;
    return { licenseeList };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilter);