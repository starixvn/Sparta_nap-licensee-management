import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';

export default class EnablePullServiceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            isLoading: false,
            isAllowApiBalance: false
        };
    };

    _onClose(callBack) {
        this.setState({ 
            isShowConfirmBox: false,
            isLoading: false,
            isAllowApiBalance: false
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
        this._toggleLoader(true);
        const url = 'LicenseeSetting/EnablePullService';
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

    _toggleLoader(isLoading) {
        this.setState({ isLoading: isLoading });
    }

    _getParams()
    {
        const { licenseeName, productCode } = this.props;
        const { isAllowApiBalance } = this.state;

        return {
            LicenseeName: licenseeName,
            ProductCode: productCode,
            IsAllowApiBalance: isAllowApiBalance
        };
    }

    _buildContent(productName, settingKey, isAllowApiBalance, callBack) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Product</label>
                    <div>{productName}</div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Setting Key</label>
                    <div>{settingKey}</div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Allow Api Balance</label>
                    <div className='group-input'>
                        <input type='checkbox' check={`${isAllowApiBalance}`} onChange={(e) => this.setState({ isAllowApiBalance: e.target.value })} />
                    </div>
                </div>
                <div className='form-group right'>
                    <button className='btn btn-primary' onClick={() => this._onSubmit()}>
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
        const { productName, settingKey, onClose, isShow } = this.props;
        const { isAllowApiBalance, isShowConfirmBox } = this.state;

        return (
        <div> 
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message={`Do you want to enable ${productName} pull service?`}
                        style={{ height: '150px', width: '400px' }}
                        onClose={(value) => this._onConfirm(value, onClose)}
                        zIndex={62} /> 
            <Popup isShow={isShow}
                title='Enable Pull Service'
                content={this._buildContent(productName, settingKey, isAllowApiBalance, onClose)}
                style={{height: '305px', width: '600px'}}
                onClose={() => this._onClose(onClose)}
                zIndex={52} />
            </div>
        );
    }
}