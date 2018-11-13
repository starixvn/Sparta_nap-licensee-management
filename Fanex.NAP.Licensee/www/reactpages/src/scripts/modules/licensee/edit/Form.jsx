import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import LaunchProductForm from './LaunchProductForm';
import OfferProductForm from './OfferProductForm';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import ConfirmBox from '../../../components/ConfirmBox';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productList: [...defaultState.productList],
            isLoading: false,
            launchPopup: { isShow: false, productCode: '', productName: '' },
            offerPopup: { isShow: false, productList: [] },
            removePopup: { isShow: false, productCode: '', productName: '' }
        }

        this.licensee = Object.assign({}, defaultState.licensee);
    }

    _launchProduct(productCode, productName) {
        const launchPopup = {
            isShow: true,
            productCode: productCode,
            productName: productName
        }

        this.setState({ launchPopup: launchPopup });
    }

    onCloseLaunchProductPopup(result, licenseeId) {
        if (result) {
            this._updateProductList(licenseeId);
        }

        const launchPopup = {
            isShow: false,
            productCode: '',
            productName: ''
        }

        this.setState({ launchPopup: launchPopup });
    }

    _offerProduct(licenseeId) {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetProductList';

        Site.fetchData({ ExcludeLicenseeId: licenseeId }, url)
            .then(response => {
                if (!response.data || response.data.length === 0) {
                    Utility.showMessage('There is no product to offer!');
                }
                else {
                    const offerPopup = {
                        isShow: true,
                        productList: response.data.map((item) => { return { label: item.ProductName, value: item.ProductCode }; })
                    }

                    this.setState({ offerPopup: offerPopup });
                }

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this._toggleLoader(false);
            });
    }

    onCloseOfferProductPopup(result, licenseeId) {
        if (result) {
            this._updateProductList(licenseeId);
        }

        const offerPopup = {
            isShow: false,
            productList: []
        }

        this.setState({ offerPopup: offerPopup });
    }

    _removeProduct(productCode, productName) {
        const removePopup = {
            isShow: true,
            productCode: productCode,
            productName: productName
        }

        this.setState({ removePopup: removePopup });
    }

    onCloseRemoveConfirmBox(value, licenseeId, licenseeName, productCode) {
        if (value) {
            this._toggleLoader(true);
            const url = 'LicenseeSetting/RemoveProduct';
            const param = {
                LicenseeName: licenseeName,
                ProductCode: productCode
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Errors);
                    }
                    else {
                        this._updateProductList(licenseeId);
                    }

                    this._toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Please try later!');
                    this._toggleLoader(false);
                });
        }

        const removePopup = {
            isShow: false,
            productCode: '',
            productName: ''
        }

        this.setState({ removePopup: removePopup });
    }

    _updateProductList(licenseeId) {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetLicenseeProductList';

        Site.fetchData({ LicenseeId: licenseeId }, url)
            .then(response => {
                this.setState({ productList: response.data });

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please refresh');
                this._toggleLoader(false);
            });
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _renderProductList(productList, isActive) {
        return (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>Effective Date</th>
                        <th>Comm</th>
                        <th>Win Loss</th>
                        { isActive && <th>Action</th> }
                    </tr>
                </thead>
                <tbody>
                {
                    productList.map((item, index) => {
                        return (
                            <tr key={item.ProductCode}>
                                <td className="text-center">{index + 1}</td>
                                <td>{item.ProductName}</td>
                                <td className="text-right">{item.EffectiveDateString}</td>
                                <td className="text-center"><span className={item.Comm ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                <td className="text-center"><span className={item.WinLoss ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                { isActive && 
                                    <td className="text-center">
                                        { 
                                            item.EffectiveDateString === null 
                                            && <span className="btn btn-green" onClick={() => this._launchProduct(item.ProductCode, item.ProductName)}>Launch</span> 
                                        }
                                        <span className="btn btn-red" onClick={() => this._removeProduct(item.ProductCode, item.ProductName)}>Remove</span>
                                    </td>
                                }
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        );
    }

    render() {
        const { isLoading, productList, launchPopup, offerPopup, removePopup } = this.state;

        return (
            <div className='edit-form'>
                <Loader isLoading={isLoading} />
                {
                    this.licensee.IsActive &&
                    <div>
                        <ConfirmBox isShow={removePopup.isShow}
                            title='Confirmation'
                            message={`Do you want to remove ${removePopup.productName}?`}
                            style={{ height: '150px', width: '400px' }}
                            onClose={(result) => this.onCloseRemoveConfirmBox(result, this.licensee.LicenseeID, this.licensee.LicenseeName, removePopup.productCode)} /> 
                        <LaunchProductForm 
                            isShow={launchPopup.isShow}
                            licenseeName={this.licensee.LicenseeName}
                            productCode={launchPopup.productCode}
                            productName={launchPopup.productName}
                            onClose={(result) => this.onCloseLaunchProductPopup(result, this.licensee.LicenseeID)} />
                        <OfferProductForm 
                            isShow={offerPopup.isShow}
                            licenseeName={this.licensee.LicenseeName}
                            productList={offerPopup.productList}
                            onClose={(result) => this.onCloseOfferProductPopup(result, this.licensee.LicenseeID)} />
                    </div>
                }
                <div className='row'>
                    <div className='col-xs-12'>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Licensee Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {this.licensee.LicenseeName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Description</label>
                            <div className='col-sx-12 col-sm-9'>
                                {this.licensee.Description}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Deposit</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={this.licensee.IsDeposit ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Affected Date</label>
                            <div className='col-sx-12 col-sm-9'>
                                {this.licensee.AffectedDateString}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Active</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={this.licensee.IsActive ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Brand Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {this.licensee.BrandName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Company Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {this.licensee.CompanyName}
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-5'>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>KPI Active</th>
                                            <th>OneWork Active</th>
                                            <th>Allow Member Comm</th>
                                            <th>Edit Bet Setting</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="text-center"><span className={this.licensee.IsKPIActive ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                            <td className="text-center"><span className={this.licensee.IsOneWorkActive ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                            <td className="text-center"><span className={this.licensee.IsAllowedMemberComm ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                            <td className="text-center"><span className={this.licensee.EditBetSetting ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-lg-5'>
                                <label className='col-form-label full-width'>
                                    Offered Products 
                                    { 
                                        this.licensee.IsActive &&
                                        <span>
                                            <button className="btn btn-green" onClick={() => this._offerProduct(this.licensee.LicenseeID)}>+ Offer New Product</button>
                                            { this.licensee.AffectedDateString === null &&  <button className="btn btn-green">Launch Licensee</button> }
                                            <button className="btn btn-primary">Generate LAP Exclusions</button>
                                        </span> 
                                    }
                                </label>                           
                                {this._renderProductList(productList, this.licensee.IsActive)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}