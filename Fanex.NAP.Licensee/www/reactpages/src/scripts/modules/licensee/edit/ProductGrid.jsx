﻿import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleLoader, getProductList } from './action';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';
import ConfirmBox from '../../../components/ConfirmBox';
import RedmineConfirmForm from '../../../components/RedmineConfirmForm';

export class ProductGrid extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmPopup: { isShow: false, msg: '', onClose: null },
            redmineConfirmPopup: { isShow: false, msg: '', onConfirm: null },
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.productList !== this.props.productList) {
            this.props.toggleLoader(false);
        }
    }

    _enablePullService(product) {
        const redmineConfirmPopup = {
            isShow: true,
            msg: `Do you want to enable ${product.ProductCode} (setting name: "${product.PullServiceKey}") pull service?`,
            onConfirm: (redmineId) => this.onEnablePullService(redmineId, product.ProductCode)
        }

        this.setState({ redmineConfirmPopup: redmineConfirmPopup });
    }

    onEnablePullService(redmineId, productCode) {
        if (redmineId) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/EnablePullService';
            const params = {
                LicenseeName: this.props.licensee.LicenseeName,
                ProductCode: productCode,
                RedmineId: redmineId
            };

            Site.fetchData(params, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Error);
                        this.props.toggleLoader(false);
                    }
                    else {
                        Utility.showMessage('Success!');
                        this._onCloseRedmineConfirmPopup();
                        this.props.getProductList(this.props.licensee.LicenseeID);
                    }
                }).catch(err => {
                    this.props.toggleLoader(false);
                });
        }
        else {
            this._onCloseRedmineConfirmPopup();
        }
    }

    _onCloseRedmineConfirmPopup() {
        const redmineConfirmPopup = { isShow: false, msg: '', onConfirm: null };

        this.setState({ redmineConfirmPopup: redmineConfirmPopup });
    }

    _removePullService(product) {
        const confirmPopup = {
            isShow: true,
            msg: `Do you want to remove pull service with key "${product.PullServiceKey}"?`,
            onClose: (result) => this.removeProduct(product, result)
        }

        this.setState({ confirmPopup: confirmPopup });
    }

    _showRemoveProductPopup(product) {
        if (product.EnablePullService) {
            this._removePullService(product);
        }
        else {
            this.removeProduct(product, false);
        }
    }

    removeProduct(product, isRemovePullService) {
        const confirmPopup = {
            isShow: false,
            msg: '',
            onClose: null
        }

        const redmineConfirmPopup = {
            isShow: true,
            msg: `Do you want to remove ${product.ProductName}${isRemovePullService ? ' and its pull service' : ''}?`,
            onConfirm: (redmineId) => this.onRemoveProduct(redmineId, product.ProductCode, isRemovePullService)
        }

        this.setState({ confirmPopup: confirmPopup, redmineConfirmPopup: redmineConfirmPopup });
    }

    onRemoveProduct(redmineId, productCode, isRemovePullService) {
        if (redmineId) {
            this.props.toggleLoader(true);
            const url = 'LicenseeSetting/RemoveProduct';
            const param = {
                LicenseeName: this.props.licensee.LicenseeName,
                ProductCode: productCode,
                IsRemovePullService: isRemovePullService,
                RedmineId: redmineId
            };

            Site.fetchData(param, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Error);
                        this.props.toggleLoader(false);
                    }
                    else {
                        Utility.showMessage('Success!');
                        this._onCloseRedmineConfirmPopup();
                        this.props.getProductList(this.props.licensee.LicenseeID);
                    }
                }).catch(err => {
                    this.props.toggleLoader(false);
                });
        }
        else {
            this._onCloseRedmineConfirmPopup();
        }
    }

    render() {
        const { productList, licensee } = this.props;
        const { confirmPopup, redmineConfirmPopup } = this.state;

        return (
            <div>
                <ConfirmBox 
                    isShow={confirmPopup.isShow}
                    title='Confirmation'
                    message={confirmPopup.msg}
                    style={{ height: '160px', width: '400px' }}
                    onClose={confirmPopup.onClose} />
                <RedmineConfirmForm isShow={redmineConfirmPopup.isShow}
                    msg={redmineConfirmPopup.msg}
                    style={{height: '210px', width: '510px'}}
                    onConfirm={redmineConfirmPopup.onConfirm} />
                <div className='row'>
                    <div className='col-xs-12'>
                        <table className="table table-bordered table-hover">
                            <thead>
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
                                            <td className="text-center">{item.Comm && <span className='glyphicon glyphicon-ok green'></span>}</td>
                                            <td className="text-center">{item.WinLoss && <span className='glyphicon glyphicon-ok green'></span>}</td>
                                            <td className="text-center">{item.EnablePullService && <span className='glyphicon glyphicon-ok green'></span>}</td>
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