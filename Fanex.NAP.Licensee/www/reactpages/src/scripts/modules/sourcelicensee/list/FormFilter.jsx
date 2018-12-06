import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams } from './action';

const defaultState = Object.assign({}, window.initialState);

export class FormFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSiteName: defaultState.selectedSiteName,
            selectedSourceSiteName: defaultState.selectedSourceSiteName,
            selectedCurrency: defaultState.selectedCurrency,
            selectedRole: defaultState.selectedRole,
            isActive: true,
            toDate: '',
            fromDate: ''
        };
    }

    _handleOnCheck = (e) => {
        const target = e.target;

        this.setState({ isActive: target.checked });
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _handleSelectedChange(name, value) {
        let selectedItem = {};
        selectedItem[name] = value;

        if (item === null) {
            selectedItem[name] = defaultState.selectedSourceSiteName;
        }
        else {
            selectedItem[name] = value;
        }

        this.setState(selectedItem);
    }

    _submit() {
        const params = {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            siteName: this.state.selectedSiteName.value,
            sourceSiteName: this.state.selectedSourceSiteName.value,
            currencyId: this.state.selectedCurrency.value,
            role: this.state.selectedRole.value,
            isActive: this.state.isActive,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    render() {
        const { selectedSiteName, selectedSourceSiteName, selectedCurrency, selectedRole, isActive, fromDate, toDate } = this.state;

        return (
            <div className='col-xs-12 filter-form form-inline'>
                <div className='form-group'>
                    <label>From Date</label>
                    <input type='date' value={fromDate} onChange={(e) => this.setState({ fromDate: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label>To Date</label>
                    <input type='date' value={toDate} onChange={(e) => this.setState({ toDate: e.target.value })} />
                </div>
                <div className='form-group'>
                    <label>Site Name</label>
                    <Select instanceId='ddlSiteName'
                        value={selectedSiteName}
                        options={defaultState.siteNameList}
                        onChange={(item) => this._handleSelectedChange('selectedSiteName', item)} />
                </div>
                <div className='form-group'>
                    <label>Source Site Name</label>
                    <Select instanceId='ddlSourceSiteName'
                        value={selectedSourceSiteName}
                        options={defaultState.siteNameList}
                        onChange={(item) => this._handleSelectedChange('selectedSourceSiteName', item)} />
                </div>
                <div className='form-group'>
                    <label>Currency</label>
                    <Select instanceId='ddlCurrency'
                        value={selectedCurrency}
                        options={defaultState.currencyList}
                        onChange={(item) => this._handleSelectedChange('selectedCurrency', item)} />
                </div>
                <div className='form-group'>
                    <label>Currency</label>
                    <Select instanceId='ddlRole'
                        value={selectedRole}
                        options={defaultState.roleList}
                        onChange={(item) => this._handleSelectedChange('selectedRole', item)} />
                </div>
                <div className='form-group'>
                    <label className='checkbox-inline'>           
                        <input type='checkbox' name='isActive' onChange={this._handleOnCheck} checked={this.state.isActive} />
                        Is Active
                    </label>
                </div>
                <div className='form-group'>
                    <button type='button' className='btn btn-primary' onClick={this._handleSubmit}>Submit</button>
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