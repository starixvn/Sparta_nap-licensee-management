import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

export default class LaunchProductForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false
        };
    };

    get isValid() {
        const date = this.state.date;

        return date !== null && date !== ''; 
    }

    _onClose(callBack) {
        this.setState({ 
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false 
        });
        callBack && callBack(false);
    }

    _onSubmit() {
        this._showConfirmBox(true);
    }

    _showConfirmBox(isShow) {
        this.setState({ isShowConfirmBox: isShow });
    }

    _onConfirm(value, closeCallBack) {
        this._showConfirmBox(false);

        if (value) {
            this._submit(closeCallBack);
        }
    }

    _submit(callBack) {
        if (!this.isValid) {
            Utility.showMessage('Invalid Effective Date!');
        }
        else {
            this._toggleLoader(true);
            const url = 'LicenseeSetting/LaunchProduct';
            const params = this._getParams();

            Site.fetchData(params, url)
                .then(response => {
                    if (!response.data.IsSuccess) {
                        Utility.showMessage(response.data.Errors);
                    }
                    else {
                        Utility.showMessage('Success!');
                        this._onClose(() => callBack(true));
                    }

                    this._toggleLoader(false);
                }).catch(err => {
                    Utility.showMessage('Error!');
                    this._toggleLoader(false);
                });
        }
    }

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _getParams()
    {
        const { licenseeName, productCode } = this.props;
        const { date } = this.state;

        return {
            LicenseeName: licenseeName,
            ProductCode: productCode,
            EffectiveDate: new Date(date)
        };
    }

    _buildContent(productCode, productName, date, callBack) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Product</label>
                    <div>{productName}</div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Effective Date</label>
                    <div className='group-input'>
                        <input className={`full-width ${this.isValid ? '' : 'has-error'}`} type='date' value={date} onChange={(e) => this.setState({ date: e.target.value })} />
                    </div>
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={() => this._onSubmit()} disabled={!this.isValid}>
                        Submit
                    </button>
                    <button className='btn btn-red' onClick={() => this._onClose(callBack)}>
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    render()
    {
        const { productCode, productName, onClose, isShow } = this.props;
        const { date, isShowConfirmBox } = this.state;

        return (
        <div> 
                <ConfirmBox isShow={isShowConfirmBox}
                            title='Confirmation'
                            message='Do you want to launch this product?'
                            style={{ height: '150px', width: '400px' }}
                            onClose={(value) => this._onConfirm(value, onClose)}
                            zIndex={63} /> 
                <Popup isShow={isShow}
                    title='Launch Product'
                    content={this._buildContent(productCode, productName, date, onClose)}
                    style={{height: '250px', width: '600px'}}
                    onClose={() => this._onClose(onClose)}
                    zIndex={53} />
            </div>
        );
    }
}