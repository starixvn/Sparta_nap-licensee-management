﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, getProductList } from './action';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import ConfirmBox from '../../../components/ConfirmBox';
import EnablePullServiceForm from './EnablePullServiceForm';

export class ProductGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmPopup: { isShow: false, msg: '', onClose: null },
            pullServicePopup: { isShow: false, productCode: '', productName: '', settingKey: '' }
        }
    }

    _enablePullService(product) {
        const pullServicePopup = {
            isShow: true,
            productCode: product.ProductCode,
            productName: product.ProductName,
            settingKey: product.PullServiceKey
        }

        this.setState({ pullServicePopup: pullServicePopup });
    }

    onCloseEnablePullServicePopup = (result) => {
        if (result) {
            this.props.getProductList(this.props.licensee.LicenseeID);
        }

        const pullServicePopup = {
            isShow: false,
            productCode: '',
            productName: '',
            settingKey: ''
        }

        this.setState({ pullServicePopup: pullServicePopup });
    }

    _removePullService(product) {
        const confirmPopup = {
            isShow: true,
            msg: `Do you want to remove pull service with key "${product.PullServiceKey}"?`,
            onClose: (result) => this._onConfirmRemovePullService(result, product)
        }

        this.setState({ confirmPopup: confirmPopup });
    }

    _onConfirmRemovePullService = (value, product) => {
        if (value) {
            this._removeProduct(product, true);
        }
        else {
            this._removeProduct(product, false);
        }
    }

    _showRemoveProductPopup(product) {
        if (product.EnablePullService) {
            this._removePullService(product);
        }
        else {
            this._removeProduct(product, false);
        }
    }

    _removeProduct(product, isRemovePullService) {
        const msg = `Do you want to remove ${product.ProductName}${isRemovePullService ? ' and its pull service' : ''}?`

        const confirmPopup = {
            isShow: true,
            msg: msg,
            onClose: (result) => this.onCloseRemoveConfirmBox(result, product.ProductCode, isRemovePullService)
        }

        this.setState({ confirmPopup: confirmPopup });
    }

    onCloseRemoveConfirmBox = (value, productCode, isRemovePullService) => {
        if (value) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/RemoveProduct';
            const param = {
                LicenseeName: this.props.licensee.LicenseeName,
                ProductCode: productCode,
                IsRemovePullService: isRemovePullService
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Error);
                    }
                    else {
                        this.props.getProductList(this.props.licensee.LicenseeID);
                    }

                    this.props.toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Please try later!');
                    this.props.toggleLoader(false);
                });
        }

        const confirmPopup = { isShow: false, msg: '', onClose: null };

        this.setState({ confirmPopup: confirmPopup });
    }

    render() {
        const { productList, licensee } = this.props;
        const { confirmPopup, pullServicePopup } = this.state;

        return (
            <div>
                <ConfirmBox 
                    isShow={confirmPopup.isShow}
                    title='Confirmation'
                    message={confirmPopup.msg}
                    style={{ height: '160px', width: '400px' }}
                    onClose={confirmPopup.onClose} />
                <EnablePullServiceForm 
                    isShow={pullServicePopup.isShow}
                    licenseeName={licensee.LicenseeName}
                    productName={pullServicePopup.productName}
                    productCode={pullServicePopup.productCode}
                    settingKey={pullServicePopup.settingKey}
                    onClose={this.onCloseEnablePullServicePopup} />
                <div className='row'>
                    <div className='col-xs-12 col-md-6'>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th colSpan={licensee.IsActive ? '7' : '6'}>
                                        Offered Products 
                                    </th>
                                </tr>
                                <tr>
                                    <th>No</th>
                                    <th>Product</th>
                                    <th>Effective Date</th>
                                    <th>Comm</th>
                                    <th>Win Loss</th>
                                    <th>Pull Service</th>
                                    { licensee.IsActive && <th>Action</th> }
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
                                            { licensee.IsActive && 
                                                <td className="text-center">
                                                    {
                                                        item.PullServiceKey && !item.EnablePullService
                                                        && <span className="btn btn-green" onClick={() => this._enablePullService(item)}>Enable Pull Service</span> 
                                                    }
                                                    <span className="btn btn-red" onClick={() => this._showRemoveProductPopup(item)}>Remove</span>
                                                </td>
                                            }
                                        </tr>
                                    );
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleLoader, getProductList }, dispatch);
}
function mapStateToProps(state) {
    const { productList, licensee } = state;
    return { productList, licensee };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGrid);