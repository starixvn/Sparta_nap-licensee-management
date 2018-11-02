import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            licenseeName: '',
            superWildCard: '',
            selectedReseller: null,
            selectedProduct: null,
            selectedSystem: null,
            isSpecial: false,
            isAllowMemberComm: true,
            isAllowWLbyLeague: false,
            isPullService: false,
            isLoading: false,
            isSuccess: false
        };
    }

    get isValid() {
        const { licenseeName, selectedReseller, isSuccess } = this.state;

        return licenseeName && selectedReseller && !isSuccess;
    }

    _onChangeLicenseeName = (e) => {
        const value = e.target.value;

        this.setState({ licenseeName: value, superWildCard: value + 'Super' });
    }

    _handleSubmit = (e) => {
        e.preventDefault();

        if (this.isValid) {
            const param = {
                LicenseeName: this.state.licenseeName,
                SuperWildCard: this.state.superWildCard,
                ResellerName: this.state.selectedReseller.value,
                ProductCode: this.state.selectedProduct == null? '' : this.state.selectedProduct.map(i => i.value).join(','),
                SystemisActive: this.state.selectedSystem == null? '' : this.state.selectedSystem.map(i => i.value).join(','),
                IsSpecial: this.state.isSpecial,
                IsAllowMemberComm: this.state.isAllowMemberComm,
                IsAllowWLbyLeague: this.state.isAllowWLbyLeague,
                IsPullService: this.state.isPullService
            };

            this._submit(param);
        }
        else {
            this._alert('Invalid input!');
        }
    }

    _submit(params) {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/SetUpNewLicensee';
        Site.fetchData(params, url)
            .then(response => {                
                if (!response.data.IsSuccess) {
                    this._alert(response.data.Errors);
                }
                else {
                    this._alert('Success!');
                    this.setState({ isSuccess: true });
                }

                this._toggleLoader(false);
            }).catch(err => {
                this._alert('Please try again!');
                this._toggleLoader(false);
            });
    }

    _alert(msg) {
        window.alert(msg);
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    render() {
        const { licenseeName, superWildCard, selectedReseller,
            selectedProduct, selectedSystem, isSpecial,
            isAllowMemberComm, isAllowWLbyLeague, isPullService,
            isLoading, isSuccess } = this.state;

        return (
            <div className='add-form'>
                <Loader isLoading={isLoading} />
                <div className='row'>
                    <div className='col-xs-12'>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Licensee Name</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='text'
                                    value={licenseeName}
                                    className={`full-width ${licenseeName ? '' : 'has-error'}`}
                                    onChange={this._onChangeLicenseeName} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Super Wild Card</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='text'
                                    value={superWildCard}
                                    className='full-width'
                                    onChange={(e) => this.setState({ superWildCard: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Reseller</label>
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
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Is Special</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='checkbox'
                                    check={`${isSpecial}`}
                                    onChange={(e) => this.setState({ isSpecial: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Allow Member Comm</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='checkbox'
                                    check={`${isAllowMemberComm}`}
                                    onChange={(e) => this.setState({ isAllowMemberComm: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Allow Win Loss By League</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='checkbox'
                                    check={`${isAllowWLbyLeague}`}
                                    onChange={(e) => this.setState({ isAllowWLbyLeague: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sm-12 col-lg-2 col-md-3 col-form-label'>Pull Service</label>
                            <div className='col-sm-12 col-md-5'>
                                <div className='group-input'>
                                    <input type='checkbox'
                                    check={`${isPullService}`}
                                    onChange={(e) => this.setState({ isPullService: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <div className='form-group row col-sm-12'>
                            <button type='button' className={`btn btn-primary ${isSuccess ? 'hide' : ''}`} onClick={this._handleSubmit} disabled={!this.isValid}>
                                Submit
                            </button>
                            <a className={`btn btn-green ${isSuccess ? '' : 'hide'}`}>
                                View New Licensee
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}