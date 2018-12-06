import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Site from '../../../lib/site';
import Utility from '../../../lib/utility';

export default class EnablePullServiceForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowConfirmBox: false,
            isLoading: false
        };
    };

    _onClose(callBack) {
        this.setState({ 
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
        this._toggleLoader(true);
        const url = 'LicenseeSetting/EnablePullService';
        const params = this._getParams();

        Site.fetchData(params, url)
            .then(response => {
                if (!response.data.IsSuccess) {
                    Utility.showMessage(response.data.Error);
                    this._toggleLoader(false);
                }
                else {
                    Utility.showMessage('Success!');
                    this._onClose(() => callBack(true));
                }
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

        return {
            LicenseeName: licenseeName,
            ProductCode: productCode
        };
    }

    _buildContent(productName, settingKey, callBack) {
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
        const { isShowConfirmBox } = this.state;

        return (
        <div>
            <ConfirmBox isShow={isShowConfirmBox}
                        title='Confirmation'
                        message={`Do you want to enable ${productName} pull service?`}
                        style={{ height: '150px', width: '400px' }}
                        onClose={(value) => this._onConfirm(value, onClose)} /> 
            <Popup isShow={isShow}
                title='Enable Pull Service'
                content={this._buildContent(productName, settingKey, onClose)}
                style={{height: '240px', width: '600px'}}
                onClose={() => this._onClose(onClose)} />
            </div>
        );
    }
}