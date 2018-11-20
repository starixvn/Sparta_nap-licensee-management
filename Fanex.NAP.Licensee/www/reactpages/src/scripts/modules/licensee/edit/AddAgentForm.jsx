import React, { Component } from 'react';
import Popup from '../../../components/Popup';
import ConfirmBox from '../../../components/ConfirmBox';
import Loader from '../../../components/Loader';
import Site from '../../../lib/site';
import Select from 'react-select';
import Utility from '../../../lib/utility';

export default class AddAgentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            superWildCard: props.licenseeName + 'Super',
            isShowConfirmBox: false,
            isSpecial: false,
            selectedCurrency: null
        };
    };

    get isValid() {
        const superWildCard = this.state.superWildCard;

        return superWildCard !== null && superWildCard !== '';
    }

    _onClose(callBack) {
        this.setState({ 
            superWildCard: this.props.licenseeName + 'Super',
            isShowConfirmBox: false,
            isSpecial: false,
            selectedCurrency: null
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
        const url = 'LicenseeSetting/AddAgent';
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
        const { superWildCard, selectedCurrency, isSpecial } = this.state;

        return {
            LicenseeName: this.props.LicenseeName,
            SuperWildCard: superWildCard,
            Currency: selectedCurrency == null ? 0 : selectedCurrency.value,
            IsSpecial: isSpecial
        };
    }

    _buildContent(selectedCurrency, currencyList, superWildCard, isSpecial, callBack) {
        return (
            <div className='edit-form'>
                <div className='form-group'>
                    <label className='col-form-label'>Supper Wild Card</label>
                    <div className='group-input'>
                        <input className={`full-width ${this.isValid ? '' : 'has-error'}`}
                            type='text'
                            value={superWildCard}
                            onChange={(e) => this.setState({ date: e.target.value })} />
                    </div>
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Currency</label>
                    <Select instanceId='ddlProduct'
                        className='full-width'
                        value={selectedCurrency}
                        options={currencyList}
                        onChange={(item) => this.setState({ selectedCurrency: item })} />
                </div>
                <div className='form-group'>
                    <label className='col-form-label'>Special</label>
                    <div className='group-input'>
                        <input type='checkbox' check={`${isSpecial}`} onChange={(e) => this.setState({ isSpecial: e.target.value })} />
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
        const { currencyList, onClose, isShow } = this.props;
        const { superWildCard, isSpecial, isShowConfirmBox, selectedCurrency } = this.state;

        return (
        <div> 
                <ConfirmBox isShow={isShowConfirmBox}
                            title='Confirmation'
                            message='Do you want to add new agent/currency?'
                            style={{ height: '150px', width: '400px' }}
                            onClose={(value) => this._onConfirm(value, onClose)} /> 
                <Popup isShow={isShow}
                    title='Add Agent/Currency'
                    content={this._buildContent(selectedCurrency, currencyList, superWildCard, isSpecial, onClose)}
                    style={{height: '350px', width: '600px'}}
                    onClose={() => this._onClose(onClose)} />
            </div>
        );
    }
}