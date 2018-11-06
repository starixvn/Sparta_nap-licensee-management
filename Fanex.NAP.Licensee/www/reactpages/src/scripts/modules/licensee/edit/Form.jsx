import React, { Component } from 'react';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';

const defaultState = Object.assign({}, window.initialState);

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productList: [...defaultState.productList],
            isLoading: false
        }

        this.licensee = Object.assign({}, defaultState.licensee);
    }

    _renderProductList(productList) {
        return (
            <table className="table table-bordered">
                <thead>       
                    <tr>
                        <th>Product</th>
                        <th>Effective Date</th>
                        <th>Comm</th>
                        <th>Win Loss</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {
                    productList.map((item) => {
                        return (
                            <tr key={item.ProductCode}>
                                <td>{item.ProductName}</td>
                                <td className="text-right">{item.EffectiveDateString}</td>
                                <td className="text-center"><span className={item.Comm ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                <td className="text-center"><span className={item.WinLoss ? 'glyphicon glyphicon-ok' : ''}></span></td>
                                <td className="text-center"><span className="icon-delete"></span></td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        );
    }

    render() {
        const { isLoading, productList } = this.state;

        return (
            <div className='edit-form'>
                <Loader isLoading={isLoading} />
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
                            <div className='col-sm-5'>
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
                            <div className='col-sm-5'>
                                <label className='col-form-label full-width'>Offered Products <span><button className="btn btn-green" onClick={this._handleSubmit}>+ Offer New Product</button></span></label>                           
                                {this._renderProductList(productList)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}