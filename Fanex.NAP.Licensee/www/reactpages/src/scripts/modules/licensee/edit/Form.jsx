import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import LaunchProductForm from './LaunchProductForm';
import OfferProductForm from './OfferProductForm';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import ConfirmBox from '../../../components/ConfirmBox';
import AddAgentForm from './AddAgentForm';
import EnablePullServiceForm from './EnablePullServiceForm';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productList: [...defaultState.productList],
            isLoading: false,
            launchPopup: { isShow: false, productCode: '', productName: '' },
            offerPopup: { isShow: false, productList: [] },
            agentPopup: { isShow: false, currencytList: [] },
            confirmPopup: { isShow: false, msg: '', onClose: null },
            licensee: Object.assign({}, defaultState.licensee),
            pullServicePopup: { isShow: false, productCode: '', productName: '', settingKey: '' }
        }
    }

    _launchProduct(productCode, productName) {
        const launchPopup = {
            isShow: true,
            productCode: productCode,
            productName: productName
        }

        this.setState({ launchPopup: launchPopup });
    }

    onCloseLaunchProductPopup = (result) => {
        if (result) {
            this._updateProductList();
        }

        const launchPopup = {
            isShow: false,
            productCode: '',
            productName: ''
        }

        this.setState({ launchPopup: launchPopup });
    }

    _enablePullService(productCode, productName, settingKey) {
        const pullServicePopup = {
            isShow: true,
            productCode: productCode,
            productName: productName,
            settingKey: settingKey
        }

        this.setState({ pullServicePopup: pullServicePopup });
    }

    onCloseEnablePullServicePopup = (result) => {
        if (result) {
            this._updateProductList();
        }

        const pullServicePopup = {
            isShow: false,
            productCode: '',
            productName: '',
            settingKey: ''
        }

        this.setState({ pullServicePopup: pullServicePopup });
    }

    _offerProduct = () => {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetProductList';

        Site.fetchData({ ExcludeLicenseeId: this.state.licensee.LicenseeID }, url)
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

    onCloseOfferProductPopup = (result) => {
        if (result) {
            this._updateProductList();
        }

        const offerPopup = {
            isShow: false,
            productList: []
        }

        this.setState({ offerPopup: offerPopup });
    }

    _terminateLicensee = () => {
        const confirmPopup = {
            isShow: true,
            msg: `Do you want to terminate this licensee?`,
            onClose: this.onCloseTerminateLicensee
        }

        this.setState({ confirmPopup: confirmPopup });
    }

    onCloseTerminateLicensee = (value) => {
        if (value) {
            this._toggleLoader(true);
            const url = 'LicenseeSetting/TerminateLicensee';
            const param = {
                LicenseeName: this.state.licensee.LicenseeName
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Errors);
                    }
                    else {
                        this._updateProductList();
                    }

                    this._toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Please try later!');
                    this._toggleLoader(false);
                });
        }

        const confirmPopup = { isShow: false, msg: '', onClose: null };

        this.setState({ confirmPopup: confirmPopup });
    }

    _removeProduct(productCode, productName) {
        const confirmPopup = {
            isShow: true,
            msg: `Do you want to remove ${productName}?`,
            onClose: (result) => this.onCloseRemoveConfirmBox(result, productCode)
        }

        this.setState({ confirmPopup: confirmPopup });
    }

    onCloseRemoveConfirmBox = (value, productCode) => {
        if (value) {
            this._toggleLoader(true);
            const url = 'LicenseeSetting/RemoveProduct';
            const param = {
                LicenseeName: this.state.licensee.LicenseeName,
                ProductCode: productCode
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Errors);
                    }
                    else {
                        this._updateProductList();
                    }

                    this._toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Please try later!');
                    this._toggleLoader(false);
                });
        }

        const confirmPopup = { isShow: false, msg: '', onClose: null };

        this.setState({ confirmPopup: confirmPopup });
    }

    _addAgent = () => {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetCurrencyList';

        Site.fetchData(null, url)
            .then(response => {
                var data = response.data ? response.data.map((item) => { return { label: item.Name, value: item.Id }; }) : []
                
                const agentPopup = {
                    isShow: true,
                    currencyList: data
                };
                this.setState({ agentPopup: agentPopup });

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this._toggleLoader(false);
            });
    }

    onCloseAddAgentPopup = (result) => {
        const agentPopup = {
            isShow: false,
            currencyList: []
        };

        this.setState({ agentPopup: agentPopup });
    }

    _updateProductList() {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetLicenseeProductList';

        Site.fetchData({ LicenseeId: this.state.licensee.LicenseeID }, url)
            .then(response => {
                this.setState({ productList: response.data });

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please refresh');
                this._toggleLoader(false);
            });
    }

    _getLapExclusions = () => {
        this._toggleLoader(true);
        const url = 'LicenseeSetting/GetLapExclusions';

        Site.fetchData({ LicenseeId: this.state.licensee.LicenseeID }, url)
            .then(response => {
                Utility.showMessage(response.data);

                this._toggleLoader(false);
            }).catch(err => {
                Utility.showMessage('Please try later!');
                this._toggleLoader(false);
            });
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _renderProductList(productList, isActive, isLaunched) {
        return (
            <table className="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th colSpan={isActive ? '7' : '6'}>
                            Offered Products 
                            {isActive && <button className="btn btn-green" onClick={this._offerProduct} title='Offer New Product'>+</button>}
                        </th>
                    </tr>
                    <tr>
                        <th>No</th>
                        <th>Product</th>
                        <th>Effective Date</th>
                        <th>Comm</th>
                        <th>Win Loss</th>
                        <th>Pull Service</th>
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
                                <td className="text-center"><span className={item.EnablePullService ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                { isActive && 
                                    <td className="text-center">
                                        { 
                                            item.EffectiveDateString === null && isLaunched
                                            && <span className="btn btn-green" onClick={() => this._launchProduct(item.ProductCode, item.ProductName)}>Launch</span> 
                                        }
                                        {
                                            item.PullServiceKey && !item.EnablePullService
                                            && <span className="btn btn-green" onClick={() => this._enablePullService(item.ProductCode, item.ProductName, item.PullServiceKey)}>Enable Pull Service</span> 
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
        const { isLoading, productList, launchPopup, offerPopup, agentPopup, confirmPopup, pullServicePopup, licensee } = this.state;

        return (
            <div className='edit-form'>
                <Loader isLoading={isLoading} />
                {
                    licensee.IsActive &&
                    <div>
                        <ConfirmBox isShow={confirmPopup.isShow}
                            title='Confirmation'
                            message={confirmPopup.msg}
                            style={{ height: '150px', width: '400px' }}
                            onClose={confirmPopup.onClose} />
                        <LaunchProductForm 
                            isShow={launchPopup.isShow}
                            licenseeName={licensee.LicenseeName}
                            productCode={launchPopup.productCode}
                            productName={launchPopup.productName}
                            onClose={this.onCloseLaunchProductPopup} />
                        <OfferProductForm 
                            isShow={offerPopup.isShow}
                            licenseeName={licensee.LicenseeName}
                            productList={offerPopup.productList}
                            onClose={this.onCloseOfferProductPopup} />
                        <AddAgentForm 
                            isShow={agentPopup.isShow}
                            licenseeName={licensee.LicenseeName}
                            currencyList={agentPopup.currencyList}
                            onClose={this.onCloseAddAgentPopup} />
                        <EnablePullServiceForm 
                            isShow={pullServicePopup.isShow}
                            licenseeName={licensee.LicenseeName}
                            productName={pullServicePopup.productName}
                            productCode={pullServicePopup.productCode}
                            settingKey={pullServicePopup.settingKey}
                            onClose={this.onCloseEnablePullServicePopup} />
                    </div>
                }  
                <div className='row'>
                    <div className='col-xs-12 col-md-6'>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Licensee Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {licensee.LicenseeName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Description</label>
                            <div className='col-sx-12 col-sm-9'>
                                {licensee.Description}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Deposit</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.IsDeposit ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Affected Date</label>
                            <div className='col-sx-12 col-sm-9'>
                                {licensee.AffectedDateString}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Active</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.IsActive ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Brand Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {licensee.BrandName}
                            </div>
                        </div>
                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Company Name</label>
                            <div className='col-sx-12 col-sm-9'>
                                {licensee.CompanyName}
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>KPI Active</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.IsKPIActive ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>OneWork Active</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.IsOneWorkActive ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Allow Member Comm</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.IsAllowedMemberComm ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>

                        <div className='form-group row'>
                            <label className='col-sx-12 col-lg-2 col-sm-3 col-form-label'>Edit Bet Setting</label>
                            <div className='col-sx-12 col-sm-9'>
                                <span className={licensee.EditBetSetting ? 'glyphicon glyphicon-ok' : ''}></span>
                            </div>
                        </div>
                        { 
                            licensee.IsActive &&
                            <div className='form-group button-group'>
                            { licensee.AffectedDateString === null &&  <button className="btn btn-green">Launch Licensee</button> }
                            { licensee.AffectedDateString !== null &&  <button className="btn btn-red" onClick={this._terminateLicensee}>Terminate Licensee</button> }
                                <button className="btn btn-green" onClick={this._addAgent}>Add Agent/Currency</button>
                                <button className="btn btn-primary" onClick={this._getLapExclusions}>Generate LAP Exclusions</button>
                            </div>
                        }     
                        <div className='form-group'>                     
                            {this._renderProductList(productList, licensee.IsActive, licensee.AffectedDateString !== null)}
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}