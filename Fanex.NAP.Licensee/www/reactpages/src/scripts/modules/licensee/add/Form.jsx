import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            licenseeName: '',
            superWildCard: '',
            selectedReseller: null,
            selectedProduct: null,
            selectedSystem: defaultState.selectedSystem,
            isSpecial: false,
            isAllowMemberComm: true,
            isLoading: false,
            isSuccess: false,
            date: Utility.getTodayString()
        };
    }

    get isValid() {
        const { licenseeName, selectedReseller, isSuccess } = this.state;

        return licenseeName && selectedReseller && !isSuccess;
    }

    _getParams() {
        return {
            LicenseeName: this.state.licenseeName,
            SuperWildCard: this.state.superWildCard,
            LicenseeType: this.state.selectedReseller.value,
            ProductCode: this.state.selectedProduct == null ? '' : this.state.selectedProduct.map(i => i.value).join(','),
            SystemisActive: this.state.selectedSystem == null ? '' : this.state.selectedSystem.map(i => i.value).join(','),
            IsSpecial: this.state.isSpecial,
            IsAllowMemberComm: this.state.isAllowMemberComm,
            EffectiveDate: this.state.date
        };
    }

    _onChangeLicenseeName = (e) => {
        const value = e.target.value;

        this.setState({ licenseeName: value, superWildCard: value + 'Super' });
    }

    _handleSubmit = () => {
        if (this.isValid) {
            const param = this._getParams();

            this._submit(param);
        }
        else {
            Utility.showMessage('Invalid input!');
        }
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/SetUpNewLicensee';
        Site.fetchData(params, url)
            .then(response => {                
                if (response.data.IsSuccess) {     
                    Utility.showMessage('Success!');
                    this.setState({ isSuccess: true });
                }
                else {
                    Utility.showMessage(response.data.Error);
                }

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try again!');
                this._toggleLoader(false);
            });
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    render() {
        const { licenseeName, superWildCard, selectedReseller,
            selectedProduct, selectedSystem, isSpecial, date,
            isAllowMemberComm, isLoading, isSuccess } = this.state;

        return (
            <div className='add-form'>
                <Loader isLoading={isLoading} />
                <div className='row'>
                    <div className='col-xs-12'>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Licensee Name</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                value={licenseeName}
                                className={`full-width ${licenseeName ? '' : 'has-error'}`}
                                onChange={this._onChangeLicenseeName} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Super Wild Card</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='text'
                                value={superWildCard}
                                className='full-width'
                                onChange={(e) => this.setState({ superWildCard: e.target.value })} />
                                <i>(Manually changing <b>"Super Wild Card"</b> value will cause wrong setting for licensee agent. Please consider carefully)</i>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Licensee Type</label>
                            <div className='col-sm-12 col-md-5'>
                                <Select instanceId='ddlReseller'
                                    className={`full-width ${selectedReseller ? '' : 'has-error'}`}
                                    value={selectedReseller}
                                    options={defaultState.resellerList}
                                    onChange={(item) => this.setState({ selectedReseller: item })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Product</label>
                            <div className='col-sm-12 col-md-5'>
                                <Select instanceId='ddlProduct'
                                    className='full-width'
                                    value={selectedProduct}
                                    options={defaultState.productList}
                                    multi={true}
                                    onChange={(item) => this.setState({ selectedProduct: item })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>System</label>
                            <div className='col-sm-12 col-md-5'>
                                <Select instanceId='ddlProduct'
                                    className='full-width'
                                    value={selectedSystem}
                                    options={defaultState.systemList}
                                    multi={true}
                                    onChange={(item) => this.setState({ selectedSystem: item })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Effective Date</label>
                            <div className='col-sm-12 col-md-5'>
                                <input className='full-width' type='date' value={date} onChange={(e) => this.setState({ date: e.target.value })} />
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Is Special</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='checkbox'
                                checked={isSpecial}
                                onChange={(e) => this.setState({ isSpecial: e.target.checked })} />
                                <div><i>(<b>Is Special</b> = true: Update [Description] of Agent with normal/affiliate/banner/income access)</i></div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Allow Member Comm</label>
                            <div className='col-sm-12 col-md-5'>
                                <input type='checkbox'
                                checked={isAllowMemberComm}
                                onChange={(e) => this.setState({ isAllowMemberComm: e.target.checked })} />
                            </div>
                        </div>
                        <div className='form-group row col-sm-12'>
                            <button className={`btn btn-primary ${isSuccess ? 'hide' : ''}`} onClick={this._handleSubmit} disabled={!this.isValid}>
                                Submit
                            </button>
                            <a className={`btn btn-green ${isSuccess ? '' : 'hide'}`} href={window.rootUrl + 'LicenseeSetting/Edit?licenseeName=' + licenseeName}>
                                View New Licensee
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}