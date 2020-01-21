import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { setParams, toggleLoader } from './action';
import Utility from '../../../lib/utility';
import Site from '../../../lib/site';

const defaultState = Object.assign({}, window.initialState);

export class FormFilterBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSiteName: defaultState.selectedSiteName,
            selectedSourceSiteName: defaultState.selectedSourceSiteName,
            selectedCurrency: defaultState.selectedCurrency,
            selectedRole: defaultState.selectedRole,
            toDate: defaultState.toDate,
            fromDate: Utility.getTodayString(),
            currencyList: defaultState.currencyList
        };
    }

    get isValid() {
        const { isRequired } = this.props;
        if (!isRequired) {
            return true;
        }

        const { selectedSiteName, selectedSourceSiteName, selectedCurrency, selectedRole, toDate, fromDate } = this.state;

        return selectedSiteName && selectedSourceSiteName && selectedCurrency && selectedRole && toDate && fromDate;
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        this._submit();
    }

    _handleSelectedChange(name, value) {
        let selectedItem = {};
        selectedItem[name] = value;

        this.setState(selectedItem);
    }

    onSourceSiteNameChange = (item) => {
        const oldValue = this.state.selectedSourceSiteName;

        this._handleSelectedChange('selectedSourceSiteName', item);

        if (oldValue !== item) {
            this._getCurrencyList(item ? item.value : 0);
        }
    }

    _submit() {
        const params = {
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            licenseeId: this.state.selectedSiteName ? this.state.selectedSiteName.value : 0,
            siteName: this.state.selectedSiteName ? this.state.selectedSiteName.label : '',
            sourceLicenseeId: this.state.selectedSourceSiteName ? this.state.selectedSourceSiteName.value : 0,
            sourceSiteName: this.state.selectedSourceSiteName ? this.state.selectedSourceSiteName.label : '',
            currencyId: this.state.selectedCurrency ? this.state.selectedCurrency.map(i => i.value).join(',') : '',
            currencyName: this.state.selectedCurrency ? this.state.selectedCurrency.map(i => i.label).join(',') : '',
            roleId: this.state.selectedRole ? this.state.selectedRole.value : 0,
            role: this.state.selectedRole ? this.state.selectedRole.label : '',
            pageIndex: 1,
            pageSize: this.props.params.pageSize || 20,
            timeStamp: new Date().getTime()
        };

        this.props.setParams(params);
    }

    _getCurrencyList(licenseeId) {
        if (licenseeId > 0) {
            this.props.toggleLoader(true);
            const url = 'SourceLicenseeSetting/GetLicenseeCurrencyList';
            const param = { LicenseeId: licenseeId };

            Site.fetchData(param, url)
                .then(response => {
                    var data = response.data ? response.data.map((item) => { return { label: item.Name, value: item.Id }; }) : []

                    this.setState({ currencyList: data, selectedCurrency: null });

                    this.props.toggleLoader(false);
                }).catch(err => {
                    this.props.toggleLoader(false);
                });
        }
        else {
            this.setState({ currencyList: defaultState.currencyList, selectedCurrency: null });
        }
    }

    render() {
        const { selectedSiteName, selectedSourceSiteName, selectedCurrency, selectedRole, fromDate, toDate, currencyList } = this.state;
        const { isRequired } = this.props;

        return (
        <div className='col-xs-12 filter-form'>
            <div className='col-xs-12 row'>
                <div className='col-xs-12 col-sm-2 form-group'>
                    <label>From Date</label>
                    <input type='date'
                        value={fromDate} 
                        className={fromDate || !isRequired ? '' : 'has-error'} 
                        onChange={(e) => this.setState({ fromDate: e.target.value })} />
                </div>
                <div className='col-xs-12 col-sm-2 form-group'>
                    <label>To Date</label>
                    <input type='date'
                        value={toDate}
                        className={toDate || !isRequired ? '' : 'has-error'}
                        onChange={(e) => this.setState({ toDate: e.target.value })} />
                </div>
                <div className='col-xs-12 col-sm-2 form-group'>
                    <label>Site Name</label>
                    <Select instanceId='ddlSiteName'
                        value={selectedSiteName}
                        options={defaultState.siteNameList}
                        className={selectedSiteName || !isRequired ? '' : 'has-error'}
                        onChange={(item) => this._handleSelectedChange('selectedSiteName', item)} />
                </div>
                <div className='col-xs-12 col-sm-2 form-group'>
                    <label>Source Site Name</label>
                    <Select instanceId='ddlSourceSiteName'
                        value={selectedSourceSiteName}
                        options={defaultState.sourceSiteNameList}
                        className={selectedSourceSiteName || !isRequired ? '' : 'has-error'}
                        onChange={this.onSourceSiteNameChange} />
                </div>
                <div className='col-xs-12 col-sm-2 form-group'>
                    <label>Role</label>
                    <Select instanceId='ddlRole'
                        value={selectedRole}
                        options={defaultState.roleList}
                        className={selectedRole || !isRequired ? '' : 'has-error'}
                        onChange={(item) => this._handleSelectedChange('selectedRole', item)} />
                </div>
            </div>
            <div className='col-xs-12 row'>
                <div className='col-xs-12 col-sm-10 form-group'>
                <label>Currency</label>
                    <Select instanceId='ddlCurrency'
                        value={selectedCurrency}
                        options={currencyList}
                        className={(selectedCurrency && selectedCurrency.length) || !isRequired ? '' : 'has-error'}
                        multi={true}
                        onChange={(item) => this._handleSelectedChange('selectedCurrency', item)} />
                </div>
            </div>
            <div className='col-xs-12 row form-group'>
                <button type='button' className='btn btn-primary' onClick={this._handleSubmit} disabled={!this.isValid}>Submit</button>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ setParams, toggleLoader }, dispatch);
}
function mapStateToProps(state) {
    const { params } = state;
    return { params };
};

export default connect(mapStateToProps, mapDispatchToProps)(FormFilterBase);