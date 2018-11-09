import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';

export default class OfferProductForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false,
            isPullServive: false,
            selectedproduct: null
        };
    };

    get isValid() {
        const selectedproduct = this.state.selectedproduct;

        return selectedproduct !== null && selectedproduct.length > 0;
    }

    _onClose(callBack) {
        this.setState({ 
            date: Utility.getTodayString(),
            isShowConfirmBox: false,
            isLoading: false,
            isPullService: false,
            selectedproduct: null
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
        const url = 'LicenseeSetting/OfferProduct';
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
        const { licenseeName } = this.props;
        const { date, isPullService, selectedproduct } = this.state;

        return {
            LicenseeName: licenseeName,
            ProductCode: selectedproduct == null ? '' : selectedproduct.map(i => i.value).join(','),
            EffectiveDate: new Date(date),
            IsPullService: isPullService
        };
    }

    _buildContent(selectedproduct, productList, date, isPullServive, callBack) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Product</label>
                    <Select instanceId='ddlProduct'
                        className={`full-width ${this.isValid ? '' : 'has-error'}`}
                        value={selectedproduct}
                        options={productList}
                        multi={true}
                        onChange={(item) => this.setState({ selectedproduct: item })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Effective Date</label>
                    <div className='group-input'>
                        <input className='full-width' type='date' value={date} onChange={(e) => this.setState({ date: e.target.value })} />
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Pull Service</label>
                    <div className='group-input'>
                        <input type='checkbox' check={`${isPullServive}`} onChange={(e) => this.setState({ isPullServive: e.target.value })} />
                    </div>
                </div>
                <div className='form-group'>
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
        const { productList, onClose, isShow } = this.props;
        const { date, isPullServive, isShowConfirmBox, selectedproduct } = this.state;

        return (
        <div> 
                <ConfirmBox isShow={isShowConfirmBox}
                            title='Confirmation'
                            message='Do you want to offer this product?'
                            style={{ height: '150px', width: '400px' }}
                            onClose={(value) => this._onConfirm(value, onClose)} /> 
                <Popup isShow={isShow}
                    title='Offer New Product'
                    content={this._buildContent(selectedproduct, productList, date, onClose)}
                    style={{height: '350px', width: '600px'}}
                    onClose={() => this._onClose(onClose)} />
            </div>
        );
    }
}